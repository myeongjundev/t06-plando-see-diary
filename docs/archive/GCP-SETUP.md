# T06 dedicated GCP VM

**Superseded:** the user selected Render Free + Neon Free. Use RENDER-NEON.md;
retain this document only as the earlier GCP alternative. Do not create this VM.

The user chose a new VM on 2026-09-01, following the CLOV deployment approach.
The existing clov-server continues to serve CLOV. No new VM has been created yet.

## Proposed creation settings

| Field | Value |
|---|---|
| Existing GCP project | Clov (`clov-500407`, observed in the user's console screenshot) |
| New instance name | `t06-server` |
| Region / zone | `us-central1` / `us-central1-a` |
| Machine family / type | E2 / `e2-micro` (1 GiB RAM, shared CPU); revised for the user's low-cost preference |
| Provisioning | Standard, not Spot |
| OS | Ubuntu 24.04 LTS, x86/64 |
| Boot disk | 30 GB standard persistent disk |
| Web ingress | HTTP and HTTPS for this new VM |
| Database | PostgreSQL container on the new VM, no public database port |

The user requested a cheaper configuration, comparable to CLOV's observed 1 GB RAM.
CLOV's exact machine type is not yet verified. Use e2-micro for a low-traffic trial,
build the image locally or in CI, and measure memory after deployment. The local
idle T06 web/DB containers used about 101 MiB combined; that is not peak load evidence.

Free Tier covers eligible e2-micro instance-hours totaling one month's hours,
combined across eligible instances/regions, not an independent allowance for every
new VM. If CLOV already consumes this allowance, T06's additional hours are billable.
External IPv4 on standard VMs is listed at $0.005/hour (about $3.65 for 730 hours),
with only one free hour/month/account. Disk, outgoing traffic and taxes may add cost.
Confirm the console estimate and billing credits; do not promise a free second VM.

Sources checked 2026-09-01:
- [Compute pricing](https://cloud.google.com/products/compute/pricing/general-purpose)
- [Machine specifications](https://docs.cloud.google.com/compute/docs/general-purpose-machines)
- [Network pricing](https://cloud.google.com/vpc/network-pricing)
- [Disk pricing](https://cloud.google.com/compute/disks-image-pricing)
- [Free Tier rules](https://docs.cloud.google.com/free/docs/free-cloud-features#compute)

## Next steps after creation

1. Record the actual instance name, zone, machine type and external IP; verify SSH
   access and available memory/disk on the new machine.
2. Build the image locally or in CI to avoid build-time memory spikes on a 1 GB VM.
   Install Docker Engine/Compose and deploy the reviewed T06 image with PostgreSQL
   and a persistent database volume. Generate a new server-only DB password.
3. Add restart policies and the HTTP/HTTPS reverse proxy configuration before
   production use; the existing compose.yml is a loopback-only local stack.
4. Verify control of an existing domain before selecting a T06 subdomain and TLS.
5. Reproduce persistence, export and public-access checks described in DEPLOYMENT.md.

No gcloud executable was found in this workstation's PATH. The user is currently
operating the authenticated GCP console through screenshots and SSH output.
Creation and SSH details are still pending. Do not describe the VM as provisioned.
