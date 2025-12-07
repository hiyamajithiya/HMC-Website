# Contact Form Email Integration Setup Guide

## Overview
The contact form is now integrated with **Resend** email service to send form submissions directly to `info@himanshumajithiya.com`.

## Features Implemented
✅ Email notifications to your office email
✅ Auto-reply confirmation email to the user
✅ Professional HTML email templates
✅ Form validation and error handling
✅ Loading states and user feedback
✅ Button readability fixed (white text on navy background)

## Setup Steps

### 1. Create a Resend Account
1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account (3,000 emails/month free tier)
3. Verify your email address

### 2. Get Your API Key
1. Log in to your Resend dashboard
2. Go to **API Keys** section
3. Click **Create API Key**
4. Give it a name (e.g., "HMC Website Contact Form")
5. Copy the API key (starts with `re_`)

### 3. Add API Key to Environment Variables
1. Open the `.env` file in your project root
2. Replace `your_resend_api_key_here` with your actual API key:
   ```
   RESEND_API_KEY="re_your_actual_api_key_here"
   ```
3. Save the file
4. **IMPORTANT**: Restart your development server for changes to take effect

### 4. Verify Your Domain (For Production)

#### Option A: Use Resend's Subdomain (Quick Start)
- You can start sending emails immediately using `onboarding@resend.dev`
- Limited to 100 emails/day
- Good for testing

#### Option B: Verify Your Custom Domain (Recommended for Production)
1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain: `himanshumajithiya.com`
4. Resend will provide DNS records (SPF, DKIM, DMARC)
5. Add these records to your domain's DNS settings (contact your domain provider)
6. Wait for verification (usually 24-48 hours)
7. Once verified, emails will be sent from `noreply@himanshumajithiya.com`

#### Updating the "From" Address
If using Resend's subdomain for testing, update the API route:

**File:** `app/api/contact/route.ts`

Change line 32 and 122:
```typescript
// From this:
from: "Contact Form <noreply@himanshumajithiya.com>",

// To this (for testing):
from: "onboarding@resend.dev",
```

### 5. Test the Contact Form
1. Navigate to the Contact page
2. Fill out the form with test data
3. Click "Send Message"
4. You should see:
   - Success message on the website
   - Email received at `info@himanshumajithiya.com`
   - Auto-reply sent to the user's email

## Email Templates

### 1. Notification Email (to your office)
- **Subject:** "New Contact Form Submission: [Subject]"
- **To:** info@himanshumajithiya.com
- **Reply-To:** User's email (you can reply directly)
- **Content:** All form details in a professional format

### 2. Auto-Reply Email (to the user)
- **Subject:** "Thank you for contacting Himanshu Majithiya & Co."
- **To:** User's email
- **Content:**
  - Confirmation of message receipt
  - 24-hour response time commitment
  - Your contact details
  - Office hours

## How Messages Are Received

1. **User submits form** → Form data sent to `/api/contact`
2. **API validates data** → Checks required fields and email format
3. **Email #1 sent to you** → Professional notification with all details
4. **Email #2 sent to user** → Auto-reply confirmation
5. **Success message shown** → User sees confirmation on website
6. **You receive email** → Check your inbox at info@himanshumajithiya.com
7. **Reply directly** → Click reply in your email to respond to the user

## Troubleshooting

### Error: "Failed to send email"
- Check if `RESEND_API_KEY` is set correctly in `.env`
- Restart your development server after adding the API key
- Verify API key is valid in Resend dashboard

### Emails not received
- Check spam/junk folder
- Verify email address in `lib/constants.ts` is correct
- If using custom domain, ensure DNS records are verified
- Try using `onboarding@resend.dev` for testing first

### "Invalid email format" error
- User entered invalid email address
- Form validation is working correctly

### Button not readable
- Fixed! Button now has `text-white` class for proper contrast

## Cost Considerations

**Resend Free Tier:**
- 3,000 emails per month
- 100 emails per day
- Perfect for a CA firm website

**Typical Usage:**
- 10 form submissions/day = 20 emails/day (notification + auto-reply)
- Well within free tier limits

## Security Notes

- ✅ API key stored in environment variables (not committed to git)
- ✅ Form validation prevents spam and malformed data
- ✅ Email addresses validated before sending
- ✅ Rate limiting by Resend prevents abuse
- ✅ HTTPS required in production

## Support

If you need help:
1. Check Resend documentation: https://resend.com/docs
2. Contact Resend support: support@resend.com
3. Check the API route logs in terminal for errors

## Files Modified

1. `app/api/contact/route.ts` - New API route for email sending
2. `app/(main)/contact/page.tsx` - Updated form with API integration
3. `.env` - Added RESEND_API_KEY
4. `.env.example` - Added RESEND_API_KEY template
5. `package.json` - Added resend package

---

**Status:** ✅ Implementation Complete
**Next Step:** Add your Resend API key to `.env` and test!
