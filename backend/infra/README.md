# Provisioning the Jawaab backend on DigitalOcean

## 0. Team / IAM (console — one-time, not Terraform)

In the DO console → Settings → Team:
- Invite **zajalist** → **Owner** (full admin + billing + team management).
- Invite **Beydhawiy** → **Owner** (co-admin; choose **Member** instead to keep
  him out of billing/team settings).
- Each person generates their own token under **API → Tokens** for CLI/Terraform.

## 1. Provision the Droplet + firewall + backup bucket

```bash
cd infra
export DIGITALOCEAN_TOKEN=<owner PAT>
terraform init
terraform apply -var 'ssh_key_fingerprints=["<your-do-ssh-fingerprint>"]'
# note the droplet_ip output
```

## 2. Deploy the stack

```bash
ssh root@<droplet_ip>
git clone <your repo> /srv/jawaab && cd /srv/jawaab/backend
cp .env.example .env && nano .env      # strong POSTGRES_PASSWORD, JWT_SECRET,
                                       # OAuth client IDs, API_DOMAIN when ready
docker compose up -d --build
curl -s http://localhost/health        # {"status":"ok"}
```

## 3. Load the data (one-time)

```bash
# put SUPABASE_SERVICE_KEY in .env first
docker compose exec api python -m scripts.migrate_from_supabase
# check real DB size to confirm the Droplet/tier:
docker compose exec postgres psql -U jawaab -d jawaab -c \
  "select pg_size_pretty(pg_database_size('jawaab'));"
```

## 4. Nightly backups

```bash
# configure s3cmd for DO Spaces, then add cron on the Droplet:
echo '0 3 * * * /srv/jawaab/backend/scripts/backup.sh >> /var/log/jawaab-backup.log 2>&1' | crontab -
```

## 5. Point a domain (when you have one)

Set `API_DOMAIN=api.yourdomain` in `.env`, add an A record → droplet_ip, then
`docker compose up -d caddy`. Caddy provisions HTTPS automatically.
