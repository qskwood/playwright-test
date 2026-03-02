import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import MailSlurp from "mailslurp-client";

dotenv.config({ path: path.resolve(__dirname, '../.env') });

test('Start Subaru Vehicle', async ({ page }) => {
  await page.goto('https://www.mysubaru.com/login.html');
  await page.fill('#username', process.env.MYSUBARU_USER || '');
  await page.fill('#password', process.env.MYSUBARU_PASSWORD || '');
  await page.click('.submitLoginForm');

  await page.click('#contact-userName');
  await page.click('#twoStepAuthenticationStep1');

  const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY || '' });
  const inbox = await mailslurp.createInbox(process.env.MYSUBARU_USER || '');
  const inboxId = inbox.id;

  const email = await mailslurp.waitForLatestEmail(inboxId, 60000);
  if (!email || !email.body) {
    throw new Error('No verification email received');
  }

  const codeMatch = email.body.match(/verification\s*code[\s\S]*?<span[^>]*class=["']size-19["'][^>]*>(\d{6})<\/span>/i) || email.body.match(/(\d{6})/);
  const code = codeMatch?.[1];
  if (!code) {
    throw new Error('Verification code not found in email');
  }
  await page.fill('#verificationCode', code);
  await page.check('#rememberDevice');
  await page.click('#twoStepAuthenticationStep2');

  await mailslurp.deleteInbox(inboxId);

  // save storage state to auth.json
  //await page.context().storageState({ path: 'auth.json' });

  await page.click('#resStartButton');
  await page.fill('#pin', process.env.MYSUBARU_PIN || '');
  await page.click('button:has-text("Submit")');
}
);

test('Stop Subaru Vehicle', async ({ page }) => {
  await page.goto('https://www.mysubaru.com/login.html');
  await page.fill('#username', process.env.MYSUBARU_USER || '');
  await page.fill('#password', process.env.MYSUBARU_PASSWORD || '');
  await page.click('.submitLoginForm');

  await page.click('#contact-userName');
  await page.click('#twoStepAuthenticationStep1');

  const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY || '' });
  const inbox = await mailslurp.createInbox(process.env.MYSUBARU_USER || '');
  const inboxId = inbox.id;

  const email = await mailslurp.waitForLatestEmail(inboxId, 60000);
  if (!email || !email.body) {
    throw new Error('No verification email received');
  }

  const codeMatch = email.body.match(/verification\s*code[\s\S]*?<span[^>]*class=["']size-19["'][^>]*>(\d{6})<\/span>/i) || email.body.match(/(\d{6})/);
  const code = codeMatch?.[1];
  if (!code) {
    throw new Error('Verification code not found in email');
  }
  await page.fill('#verificationCode', code);
  await page.check('#rememberDevice');
  await page.click('#twoStepAuthenticationStep2');

  await mailslurp.deleteInbox(inboxId);

  // save storage state to auth.json
  //await page.context().storageState({ path: 'auth.json' });

  await page.waitForSelector('#resStopButton', { state: 'attached' });
  await page.evaluate(() => {
    const stopbutton = document.querySelector('#resStopButton');
    stopbutton?.classList.remove('display-hide');
  });
  await page.click('#resStopButton');
  await page.fill('#pin', process.env.MYSUBARU_PIN || '');
  await page.click('button:has-text("Submit")');
}
);
