# Setup A Custom Domain

To host websites on a custom domain on freestyle, there are two steps.

1. Verify Ownership

This can be done either in the [Freestyle Sandboxes Dashboard](https://admin.freestyle.sh) or via API. To do it through the API, you first need to create a [domain verification request](https://api.freestyle.sh/#tag/domains/POST/domains/v1/verifications), then place that token in a TXT record at `_freestyle_custom_hostname.thedomainyouwanttoverify.com`

We make you do this, so we can verify your Freestyle Sandboxes Account has control of your domain. 

Once the record is there, call the [verify domain ownership](https://api.freestyle.sh/#tag/domains/PUT/domains/v1/verifications) endpoint. We will check that the `_freestyle_custom_hostname` TXT record is there. Assuming it is setup correctly, the server will confirm your ownership. You should be able to see it in the [Freestyle Sandboxes Dashboard](https://admin.freestyle.sh).

By verifying `yourdomain.com`, we allow you to deploy to `anysubdomain.yourdomain.com` along with `yourdomain.com`

2. Point your domain at us

If you want to host at just yourdomain.com, add the following record:

```
@ A 35.235.84.134
```

If you want to deploy to any subdomain of yourdomain.com, add the following record:
```
* A 35.235.84.134
```

If you want to deploy to specific subdomains point them at the following record
```
specificsub. A 35.235.84.134	
```

3. (Bonus) Provision a wildcard for faster deploys

By default, when Freestyle sees a new exact domain, we provision a new certificate for it. This is generally the biggest slowdown in deploy time. To make this faster, you can pre-provision wildcards for specific domains you control.

This would mean for if you provision a wildcard certificate for `yourdomain.com`, then deploys to `anysubdomain.yourdomain.com` would become much faster. This will not speed up deploys to domains not directly under `yourdomain.com`

To provision a wildcard, add the following record to the domain you want to provision it for

```
_acme-challenge NS dns.freestyle.sh
```

This delegates managing this record to us, allowing us to execute [DNS-01 challenges](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge) on your behalf.

Once that NS record is there, call the [Provision Wildcard Endpoint](https://api.freestyle.sh/#tag/certs/POST/domains/v1/certs/{domain}/wildcard) endpoint. It takes up to 2 minutes to run, if it succeeds it will tell you in its response.
