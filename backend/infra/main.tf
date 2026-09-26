# Reproducible DigitalOcean infrastructure for the Jawaab backend.
#
# Provisions a single Droplet (runs the Docker Compose stack), a firewall, and an
# optional Spaces bucket for nightly Postgres backups. Team membership / IAM roles
# (zajalist + Beydhawiy as Owners) are managed in the DO console, not here —
# Terraform's DO provider cannot invite team members.
#
# Usage:
#   export DIGITALOCEAN_TOKEN=<your PAT>
#   terraform init && terraform apply

terraform {
  required_version = ">= 1.5"
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.43"
    }
  }
}

variable "do_token" {
  type        = string
  description = "DigitalOcean API token (or set DIGITALOCEAN_TOKEN)."
  default     = null
}

variable "region" {
  type    = string
  default = "fra1" # Frankfurt — closest to a .de audience
}

variable "droplet_size" {
  type        = string
  default     = "s-1vcpu-2gb" # ~$12/mo; drop to s-1vcpu-1gb (~$6) to start lean
  description = "Droplet slug."
}

variable "ssh_key_fingerprints" {
  type        = list(string)
  description = "Fingerprints of SSH keys already uploaded to DO."
}

variable "enable_spaces_backup" {
  type    = bool
  default = true
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_droplet" "api" {
  name     = "jawaab-api"
  region   = var.region
  size     = var.droplet_size
  image    = "docker-20-04" # Docker preinstalled
  ssh_keys = var.ssh_key_fingerprints
  tags     = ["jawaab", "backend"]

  # The stack is deployed by cloning the repo and running docker compose; kept out
  # of user_data so secrets never live in Droplet metadata. See infra/README.md.
}

resource "digitalocean_firewall" "api" {
  name        = "jawaab-api-fw"
  droplet_ids = [digitalocean_droplet.api.id]

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"] # tighten to your IPs in production
  }
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
  outbound_rule {
    protocol              = "udp"
    port_range            = "53"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}

resource "digitalocean_spaces_bucket" "backups" {
  count  = var.enable_spaces_backup ? 1 : 0
  name   = "jawaab-backups"
  region = var.region
  acl    = "private"
}

output "droplet_ip" {
  value = digitalocean_droplet.api.ipv4_address
}

output "backup_bucket" {
  value = var.enable_spaces_backup ? digitalocean_spaces_bucket.backups[0].name : "disabled"
}
