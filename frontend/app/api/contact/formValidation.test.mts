import assert from 'node:assert/strict'
import test from 'node:test'

import {formatUsPhoneNumber} from '../../lib/formatUsPhoneNumber.ts'
import {
  contactFormSchema,
  isAllowedRecaptchaHostname,
  isHoneypotFilled,
  MAX_CONTACT_BODY_BYTES,
  readContactBody,
} from './formValidation.ts'

const validPayload = {
  name: 'Taylor Smith',
  email: 'taylor@example.com',
  phone: '(314) 631-6738',
  service: 'Transportation',
  message: 'I would like to learn more about transportation.',
  companyWebsite: '',
  recaptchaToken: 'token',
}

test('formats a ten-digit US phone number progressively', () => {
  assert.equal(formatUsPhoneNumber('314'), '314')
  assert.equal(formatUsPhoneNumber('314631'), '(314) 631')
  assert.equal(formatUsPhoneNumber('3146316738'), '(314) 631-6738')
  assert.equal(formatUsPhoneNumber('+1 (314) 631-6738'), '(314) 631-6738')
  assert.equal(formatUsPhoneNumber('(314) 631-6738 extra digits'), '(314) 631-6738')
})

test('accepts the published Kingdom Canine form contract', () => {
  assert.equal(contactFormSchema.safeParse(validPayload).success, true)
})

test('accepts editor-added string fields but rejects non-string values', () => {
  assert.equal(
    contactFormSchema.safeParse({...validPayload, preferredDate: 'Next Tuesday'}).success,
    true,
  )
  assert.equal(
    contactFormSchema.safeParse({...validPayload, preferredDate: {nested: 'object'}}).success,
    false,
  )
})

test('accepts any CMS-defined service value and rejects oversized messages', () => {
  assert.equal(
    contactFormSchema.safeParse({...validPayload, service: 'A New CMS Service'}).success,
    true,
  )
  assert.equal(
    contactFormSchema.safeParse({...validPayload, message: 'x'.repeat(5001)}).success,
    false,
  )
  assert.equal(
    contactFormSchema.safeParse({...validPayload, extraField: 'x'.repeat(5001)}).success,
    false,
  )
})

test('rejects invalid phone numbers and control characters in names', () => {
  assert.equal(contactFormSchema.safeParse({...validPayload, phone: 'not-a-phone'}).success, false)
  assert.equal(contactFormSchema.safeParse({...validPayload, name: 'Taylor\nBcc: test'}).success, false)
})

test('recognizes only non-empty honeypot values', () => {
  assert.equal(isHoneypotFilled('https://spam.example'), true)
  assert.equal(isHoneypotFilled('  '), false)
  assert.equal(isHoneypotFilled(undefined), false)
})

test('allows only the intended production, preview, and local hostnames', () => {
  assert.equal(isAllowedRecaptchaHostname('www.kingdomcanine.com', {nodeEnv: 'production'}), true)
  assert.equal(isAllowedRecaptchaHostname('kingdomcanine.com', {nodeEnv: 'production'}), true)
  assert.equal(isAllowedRecaptchaHostname('evil.example', {nodeEnv: 'production'}), false)
  assert.equal(
    isAllowedRecaptchaHostname(
      'kingdom-canine-frontend-ab12cd34-mhlauf1s-projects.vercel.app',
      {
        nodeEnv: 'production',
        vercelEnv: 'preview',
        vercelUrl: 'kingdom-canine-frontend-ab12cd34-mhlauf1s-projects.vercel.app',
      },
    ),
    true,
  )
  assert.equal(
    isAllowedRecaptchaHostname(
      'kingdom-canine-frontend-git-fix-conta-6f9ecd-mhlauf1s-projects.vercel.app',
      {
        nodeEnv: 'production',
        vercelEnv: 'preview',
        vercelBranchUrl:
          'kingdom-canine-frontend-git-fix-conta-6f9ecd-mhlauf1s-projects.vercel.app',
      },
    ),
    true,
  )
  assert.equal(
    isAllowedRecaptchaHostname(
      'kingdom-canine-frontend-unrelated-mhlauf1s-projects.vercel.app',
      {
        nodeEnv: 'production',
        vercelEnv: 'preview',
        vercelUrl: 'kingdom-canine-frontend-ab12cd34-mhlauf1s-projects.vercel.app',
      },
    ),
    false,
  )
  assert.equal(isAllowedRecaptchaHostname('localhost', {nodeEnv: 'development'}), true)
})

test('rejects an oversized JSON body even when content-length is absent', async () => {
  const request = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({message: 'x'.repeat(MAX_CONTACT_BODY_BYTES)}),
  })

  assert.equal(request.headers.get('content-length'), null)
  assert.deepEqual(await readContactBody(request), {status: 'too-large'})
})

test('rejects a non-JSON request body', async () => {
  const request = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {'content-type': 'text/plain'},
    body: 'not json',
  })

  assert.deepEqual(await readContactBody(request), {status: 'invalid'})
})

test('reads a valid JSON request body', async () => {
  const request = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {'content-type': 'application/json; charset=utf-8'},
    body: JSON.stringify(validPayload),
  })

  assert.deepEqual(await readContactBody(request), {status: 'valid', value: validPayload})
})
