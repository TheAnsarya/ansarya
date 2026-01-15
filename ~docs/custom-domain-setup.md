# Custom Domain Setup: ansarya.com → GitHub Pages

This guide walks you through configuring `ansarya.com` to point to your GitHub Pages site at `theansarya.github.io/ansarya`.

## Overview

You need to complete these steps in order:
1. ✅ Update CNAME file (already done)
2. Configure DNS in Cloudflare
3. Configure custom domain in GitHub Pages settings
4. Wait for DNS propagation and SSL certificate

---

## Step 1: ✅ CNAME File Updated

The CNAME file in your repository root now contains:
```
ansarya.com
```

This tells GitHub Pages which custom domain to use.

---

## Step 2: Configure DNS in Cloudflare

### 2.1 Add Domain to Cloudflare

If you haven't already:

1. Go to [Cloudflare](https://dash.cloudflare.com/)
2. Sign up or log in
3. Click "Add a Site"
4. Enter `ansarya.com`
5. Select the Free plan
6. Cloudflare will scan your existing DNS records
7. Click "Continue"

### 2.2 Update Nameservers at Your Registrar

Cloudflare will provide you with nameservers (e.g., `ns1.cloudflare.com`, `ns2.cloudflare.com`):

1. Log in to your domain registrar (where you bought ansarya.com - e.g., Namecheap, GoDaddy, Google Domains)
2. Find the DNS/Nameserver settings
3. Replace existing nameservers with Cloudflare's nameservers
4. Save changes
5. Wait for propagation (can take up to 24 hours, usually 15-30 minutes)

### 2.3 Configure DNS Records in Cloudflare

Once your domain is active in Cloudflare:

1. Go to DNS → Records
2. Delete any existing A or CNAME records for `@` (root) and `www`
3. Add the following records:

#### For Root Domain (ansarya.com):

Add **FOUR** A records pointing to GitHub Pages IPs:

```
Type: A
Name: @
IPv4 address: 185.199.108.153
Proxy status: ✅ Proxied (orange cloud)
TTL: Auto
```

```
Type: A
Name: @
IPv4 address: 185.199.109.153
Proxy status: ✅ Proxied (orange cloud)
TTL: Auto
```

```
Type: A
Name: @
IPv4 address: 185.199.110.153
Proxy status: ✅ Proxied (orange cloud)
TTL: Auto
```

```
Type: A
Name: @
IPv4 address: 185.199.111.153
Proxy status: ✅ Proxied (orange cloud)
TTL: Auto
```

#### For WWW Subdomain:

```
Type: CNAME
Name: www
Target: theansarya.github.io
Proxy status: ✅ Proxied (orange cloud)
TTL: Auto
```

**Important**: Keep the Proxy status as "Proxied" (orange cloud icon) for all records. This enables Cloudflare's CDN and SSL.

---

## Step 3: Configure SSL/TLS in Cloudflare

1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to: **Full** (or **Full (strict)** if you have GitHub's SSL)

3. Go to **SSL/TLS** → **Edge Certificates**
4. Enable these settings:
   - ✅ **Always Use HTTPS**
   - ✅ **Automatic HTTPS Rewrites**
   - ✅ **Minimum TLS Version**: 1.2

Cloudflare will automatically provision a free Universal SSL certificate (usually takes 5-15 minutes, max 24 hours).

---

## Step 4: Configure Custom Domain in GitHub

1. Go to your repository: https://github.com/TheAnsarya/ansarya
2. Click **Settings** (top tab)
3. Click **Pages** (left sidebar, under "Code and automation")
4. Under **Custom domain**, enter: `ansarya.com`
5. Click **Save**

GitHub will perform a DNS check (may take a few minutes).

6. Once DNS check passes, you'll see:
   - ✅ DNS check successful
   - An option to **Enforce HTTPS** will appear

7. Check the box: ✅ **Enforce HTTPS**

**Note**: If "Enforce HTTPS" is not immediately available, wait a few minutes and refresh. GitHub needs to provision its SSL certificate first.

---

## Step 5: Verification & Testing

### 5.1 Check DNS Propagation

Use these tools to verify DNS is propagating:
- https://www.whatsmydns.net/ (enter `ansarya.com`)
- https://dnschecker.org/ (enter `ansarya.com`)

Look for the GitHub Pages IPs (185.199.108-111.153) to appear worldwide.

### 5.2 Test Your Site

After DNS propagates (15 minutes to 24 hours):

1. Visit `http://ansarya.com` → Should redirect to `https://ansarya.com`
2. Visit `https://ansarya.com` → Should load your site with SSL
3. Visit `https://www.ansarya.com` → Should also work
4. Check SSL certificate:
   - Click the padlock icon in browser
   - Should show a valid certificate (from Cloudflare)

### 5.3 Verify in GitHub

In your GitHub repository Settings → Pages, you should see:
- ✅ Your site is live at https://ansarya.com
- ✅ Enforce HTTPS enabled

---

## Troubleshooting

### "DNS check failed" in GitHub

**Cause**: DNS not propagated yet or incorrect configuration

**Solutions**:
1. Wait 30-60 minutes for DNS propagation
2. Verify A records point to correct GitHub IPs
3. Remove and re-add custom domain in GitHub settings
4. Check CNAME file exists and contains `ansarya.com`

### "Too many redirects" error

**Cause**: SSL/TLS mode mismatch

**Solution**:
1. Go to Cloudflare → SSL/TLS → Overview
2. Change to **Full** (not Flexible, not Strict)
3. Wait a few minutes and try again

### "404 - There isn't a GitHub Pages site here"

**Causes**:
1. CNAME file is missing or incorrect
2. GitHub Pages not enabled
3. Deploying from wrong folder

**Solutions**:
1. Verify CNAME file contains `ansarya.com` (no www, no https://)
2. Check Settings → Pages shows source as `main` branch, `/ (root)` folder
3. Check Actions tab for deployment status
4. Commit and push CNAME file again

### HTTPS not available in GitHub

**Cause**: SSL certificate not provisioned yet

**Solutions**:
1. Wait up to 24 hours after adding custom domain
2. Ensure DNS is fully propagated
3. Remove custom domain, wait 5 minutes, add it back
4. Check Cloudflare SSL/TLS is set to **Full**

### WWW not working

**Cause**: Missing CNAME record for www

**Solution**:
1. Add CNAME record: `www` → `theansarya.github.io`
2. Ensure Proxy is enabled (orange cloud)
3. Wait for DNS propagation

---

## Quick Reference

### DNS Records Summary

| Type  | Name | Value/Target          | Proxy  |
|-------|------|-----------------------|--------|
| A     | @    | 185.199.108.153       | ✅ On  |
| A     | @    | 185.199.109.153       | ✅ On  |
| A     | @    | 185.199.110.153       | ✅ On  |
| A     | @    | 185.199.111.153       | ✅ On  |
| CNAME | www  | theansarya.github.io  | ✅ On  |

### Cloudflare Settings Checklist

- ✅ SSL/TLS Mode: **Full**
- ✅ Always Use HTTPS: **Enabled**
- ✅ Automatic HTTPS Rewrites: **Enabled**
- ✅ Minimum TLS: **1.2**
- ✅ Proxy Status: **Enabled** (orange cloud)

### GitHub Settings Checklist

- ✅ Repository: TheAnsarya/ansarya
- ✅ Pages enabled: **Yes**
- ✅ Source: **main** branch, **/ (root)** folder
- ✅ CNAME file: Contains `ansarya.com`
- ✅ Custom domain: `ansarya.com`
- ✅ Enforce HTTPS: **Enabled**

---

## Timeline Expectations

| Step                          | Time Required          |
|-------------------------------|------------------------|
| Update CNAME file             | Instant                |
| Commit and push to GitHub     | Instant                |
| Nameserver propagation        | 15 min - 24 hours      |
| DNS record propagation        | 5 min - 24 hours       |
| Cloudflare SSL provisioning   | 5 min - 24 hours       |
| GitHub DNS check              | 1-5 minutes            |
| GitHub SSL certificate        | 5 min - 24 hours       |
| **Total (worst case)**        | **Up to 48 hours**     |
| **Total (typical)**           | **30-60 minutes**      |

---

## Additional Resources

- [GitHub Pages Custom Domain Docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Cloudflare DNS Documentation](https://developers.cloudflare.com/dns/)
- [GitHub Pages IP Addresses](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain)
- [Cloudflare SSL/TLS Modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/)

---

## Next Steps After Setup

Once `ansarya.com` is working:

1. **Update all links** in your extension/project to use `ansarya.com`
2. **Test VS Code Marketplace verification** with the custom domain
3. **Add domain to package.json** homepage field
4. **Update README.md** with the new domain
5. **Set up analytics** (optional - Google Analytics, Plausible, etc.)

---

**Status**: CNAME file updated and committed. Proceed with DNS configuration in Cloudflare and GitHub Pages settings.
