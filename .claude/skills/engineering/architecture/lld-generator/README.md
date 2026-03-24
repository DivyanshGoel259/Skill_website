# LLD Generator Skill

Professional Low-Level Design (LLD) document generator for Azure infrastructure projects.

## Quick Start

**Invoke this skill by asking:**
- "Create an LLD for the Platform landing zone"
- "Generate an LLD from the Bicep code in ./infra"
- "I need a template LLD for my workload"
- "Generate infrastructure documentation from my Terraform files"

## What It Does

The lld-generator skill creates comprehensive Low-Level Design documents that:

✅ Follow the **lld-template-standard.md** structure
✅ Extract specifications from **Bicep, Terraform, and ARM** templates
✅ Validate resource names against **naming-convention.md**
✅ Validate IP ranges against **ip-addressing-scheme.md**
✅ Generate template LLDs or code-based LLDs
✅ Save to correct locations (Templates or Customer directories)

## Two Generation Modes

### 1. Template LLD (Starter Document)
Creates an empty LLD with proper structure for manual completion.

**Use when:** Starting a new project and need an LLD template to fill in.

**Output:** Structured markdown with placeholder tables and sections.

### 2. Code-Based LLD (Reverse Engineering)
Analyzes existing IaC code and generates populated LLD documentation.

**Use when:** You have Bicep/Terraform/ARM code and need documentation.

**Output:** Complete LLD with extracted resource specs, IPs, NSG rules, etc.

## Supported IaC Formats

- **Bicep** (`.bicep`)
- **Terraform** (`.tf`)
- **ARM Templates** (`.json`)

## File Structure

```
.claude/skills/lld-generator/
├── SKILL.md       # Main skill instructions and logic
├── EXAMPLES.md    # Detailed examples of generated LLDs
└── README.md      # This file
```

## Generated LLD Location

LLDs are saved to:

- **Templates**: `Architecture/Templates/LLD/lld-[name].md`
- **Customer Projects**: `Architecture/Customer/[customercode]/LLD/lld-[project]-[landingzone].md`

## Example Usage

### Example 1: Create Template LLD

**You ask:**
> "Create a template LLD for the Identity landing zone"

**Claude will:**
1. Ask for project name, author, save location
2. Read lld-template-standard.md
3. Generate structured template with all required sections
4. Save to chosen location (e.g., `Architecture/Templates/LLD/lld-identity-template.md`)

### Example 2: Generate from Bicep Code

**You ask:**
> "Generate an LLD from the Bicep files in ./infra/platform"

**Claude will:**
1. Ask for project name, author, save location
2. Find all `.bicep` files in `./infra/platform`
3. Extract VNets, subnets, NSGs, VMs, policies, etc.
4. Validate against naming and IP standards
5. Generate complete LLD with real values
6. Save to chosen location (e.g., `Architecture/Customer/contoso/LLD/lld-contoso-platform.md`)

## What Gets Extracted from Code

When analyzing IaC files, the skill extracts:

- Virtual Networks and subnets with IP ranges
- Network Security Groups and all rules
- Route tables and routes
- Virtual machines (size, OS, availability)
- PaaS services (Key Vault, Storage, etc.)
- Azure Firewall configurations
- VNet peering relationships
- Resource tags
- RBAC assignments
- Azure Policy assignments
- Backup configurations
- Monitoring settings

## Standards Referenced

All generated LLDs reference and validate against:

- **[lld-template-standard.md](../../../docs/standards/lld-template-standard.md)** - Document structure
- **[naming-convention.md](../../../docs/standards/naming-convention.md)** - Resource naming rules
- **[ip-addressing-scheme.md](../../../docs/standards/ip-addressing-scheme.md)** - Network IP allocation

## Validation Performed

The skill automatically validates:

✅ Resource names follow naming conventions
✅ IP ranges align with IP addressing scheme
✅ Character limits are respected
✅ Environment codes are correct (d, t, a, p)
✅ Region codes are valid (weu = West Europe)
✅ All required LLD sections are present
✅ Tables are properly formatted
✅ Cross-references are included

## Output Quality

Generated LLDs include:

- **Document Properties**: Version, author, date, status
- **Introduction**: Background, purpose, scope
- **Design Overview**: Context, naming, tagging
- **Subscription Details**: Resources, network, security, RBAC
- **Deployment Specs**: Order, IaC references, prerequisites
- **Validation & Testing**: Checklists and test scenarios
- **Operations**: Procedures and maintenance windows
- **Appendix**: IP allocation, references, change log

## Customization

**Default filename format:** `lld-[project]-[landingzone].md`

**Examples:**
- `lld-contoso-platform.md`
- `lld-fabrikam-identity.md`
- `lld-adventureworks-ecommerce.md`

You can also provide a custom filename when generating the LLD.

## Tips

1. **For new projects**: Use template mode and fill in sections manually
2. **For existing infrastructure**: Use code-based mode to document current state
3. **Review generated LLDs**: Always review and complete any `[To be determined]` sections
4. **Keep updated**: Regenerate LLDs when infrastructure changes significantly
5. **Validation**: The skill flags naming and IP addressing violations for your review

## Related Skills

- **azure-landingzone-generator**: Generate Azure Landing Zone IaC code
- **azure-workload-generator**: Generate spoke workload infrastructure
- **skill-maker**: Create new Claude Code skills

## Need Help?

See **SKILL.md** for detailed instructions and logic.
See **EXAMPLES.md** for complete example outputs.

---

**Version:** 1.0
**Created:** 2026-01-07
**Maintained by:** Azure Infrastructure Agent Project
