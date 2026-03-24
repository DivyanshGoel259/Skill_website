---
name: lld-generator
description: Generate professional Low-Level Design (LLD) documents in Markdown following lld-template-standard.md. Creates template LLDs or reverse-engineers from existing IaC code (Bicep, Terraform, ARM). Use when creating architecture documentation, infrastructure specifications, Azure landing zone designs, or when user mentions LLD, Low-Level Design, technical specifications, or implementation documentation.
---

# LLD Generator

Generate comprehensive Low-Level Design (LLD) documents following enterprise standards for Azure infrastructure projects.

## Overview

This skill creates professional LLD documentation that:
- Follows the structure defined in `docs/standards/lld-template-standard.md`
- References `docs/standards/naming-convention.md` for resource naming
- References `docs/standards/ip-addressing-scheme.md` for network design
- Can generate template LLDs (starter documents) or reverse-engineer from existing IaC code
- Supports Bicep, Terraform, and ARM template analysis
- Saves documents in appropriate locations (Templates or Customer-specific)

## When to Use This Skill

- User asks to create/generate an LLD document
- User mentions "Low-Level Design", "technical specifications", or "implementation documentation"
- User requests documentation for infrastructure code
- User needs a template LLD for a new landing zone or project
- Keywords: LLD, architecture documentation, infrastructure specs, landing zone design

## Instructions

### Phase 1: Determine LLD Type

Ask the user what type of LLD they want to create:

1. **Template LLD**: Empty/starter LLD with standard structure for manual completion
2. **Code-Based LLD**: Reverse-engineer from existing Infrastructure-as-Code files

### Phase 2: Gather Required Information

#### For Template LLD:
Ask the user for:
- **Project Name**: Name of the project/client
- **Landing Zone Type**: Platform, Identity, Connectivity, Management, or Workload name
- **Environment**: Production (p), Development (d), Test (t), Acceptance (a)
- **Author Name**: Person creating the document
- **Save Location**:
  - Template: `Architecture/Templates/LLD/`
  - Customer: `Architecture/Customer/[customercode]/LLD/` (ask for customer code)
- **Filename**: Default is `lld-[project]-[landingzone].md` or user can provide custom name

#### For Code-Based LLD:
Ask the user for:
- **IaC Files Location**: Path to Bicep, Terraform, or ARM template files
- **Project Name**: Name of the project/client (extract from code if possible)
- **Landing Zone Type**: Extract from code or ask user
- **Author Name**: Person creating the document
- **Save Location**: Template or Customer (ask for customer code if customer)
- **Filename**: Default is `lld-[project]-[landingzone].md` or user can provide custom name

### Phase 3: Read Required Standards

Before generating the LLD, **ALWAYS** read these files:

```bash
# Read the LLD template standard
Read: docs/standards/lld-template-standard.md

# Read the naming convention standard
Read: docs/standards/naming-convention.md

# Read the IP addressing scheme
Read: docs/standards/ip-addressing-scheme.md
```

### Phase 4A: Generate Template LLD

For template LLDs, create a document with:

1. **Document Properties** (Section 1):
   - Fill in project name, client, landing zone, date, author
   - Set version to 1.0
   - Set status to Draft
   - Include version history table

2. **Introduction** (Section 2):
   - Add placeholder background (reference to HLD)
   - Add purpose statement
   - Add scope definition
   - Optional reference architecture section

3. **Design Overview** (Section 3):
   - Landing zone context with placeholder text
   - Naming and tagging section with reference to standards
   - Include mandatory tags list

4. **Subscription Details** (Section 4):
   - Create section 4.1 for the first subscription
   - Include all subsections with placeholder tables:
     - 4.X.1 Subscription Overview
     - 4.X.2 Resource Groups
     - 4.X.3 Compute Resources (if applicable)
     - 4.X.4 Network Configuration (VNet, Peering, NSG, ASG, Route Tables)
     - 4.X.5 PaaS Services
     - 4.X.6 VM Backup
     - 4.X.7 Monitoring and Diagnostics
     - 4.X.8 Security
     - 4.X.9 Azure Policies
     - 4.X.10 Cost Management
     - 4.X.11 Access Control (RBAC)

5. **Deployment Specifications** (Section 5):
   - Deployment order with placeholder steps
   - IaC table with placeholders
   - Prerequisites section
   - Post-deployment configuration section

6. **Validation and Testing** (Section 6):
   - Validation checklist with standard items
   - Test scenarios section

7. **Operations and Maintenance** (Section 7):
   - Operational procedures with placeholder links
   - Maintenance windows table

8. **Appendix** (Section 8):
   - Appendix A: IP Address Allocation (empty table)
   - Appendix B: References (links to standards)
   - Appendix C: Change Log (initial version entry)

### Phase 4B: Generate Code-Based LLD

For LLDs generated from existing code:

1. **Analyze IaC Files**:
   - Use Glob to find all relevant files: `**/*.bicep`, `**/*.tf`, `**/*.json` (ARM)
   - Read all infrastructure files in the specified location
   - Extract resource definitions, configurations, and relationships

2. **Extract Information**:

   **From Bicep/ARM/Terraform, identify:**
   - Subscription structure and resource groups
   - Virtual Networks (VNets) and subnets with IP ranges
   - Network Security Groups (NSGs) and security rules
   - Route tables and routes
   - Virtual machines (names, sizes, OS, availability sets)
   - PaaS services (Key Vaults, Storage Accounts, etc.)
   - Backup configurations (Recovery Services Vaults, policies)
   - Monitoring (Log Analytics Workspaces, diagnostic settings)
   - Azure Policies and assignments
   - RBAC role assignments
   - Tags applied to resources

3. **Generate Complete LLD**:
   - Populate all sections with extracted data
   - Create actual tables with real values from code
   - Document specific resource names, IPs, SKUs, configurations
   - **Validate naming** against naming-convention.md
   - **Validate IP ranges** against ip-addressing-scheme.md
   - Include deployment order based on resource dependencies
   - Add validation checklist items relevant to deployed resources

4. **Handle Missing Information**:
   - If critical information is missing, note as "[To be determined]" with a comment
   - Suggest where the information should come from
   - Mark incomplete sections for user review

### Phase 5: Validate Generated LLD

Before saving, validate the LLD:

- [ ] Document properties section is complete
- [ ] All resource names follow naming-convention.md patterns
- [ ] All IP ranges align with ip-addressing-scheme.md
- [ ] All required sections (1-8) are present
- [ ] Tables are properly formatted
- [ ] Cross-references to standards are included
- [ ] No orphaned placeholders (unless intentional for templates)
- [ ] Markdown syntax is correct

### Phase 6: Save the LLD

1. **Ensure directory exists**:
   ```bash
   mkdir -p [save-location]
   ```

2. **Write the LLD file**:
   ```bash
   Write: [save-location]/[filename].md
   ```

3. **Confirm to user**:
   - Display the full path where LLD was saved
   - Provide a summary of what was generated
   - List any sections that need manual completion

## Examples

### Example 1: Creating a Template LLD

**User request**: "Create a template LLD for the Platform landing zone"

**Actions**:
1. Ask for: Project name, author, save location
2. Read: lld-template-standard.md, naming-convention.md, ip-addressing-scheme.md
3. Generate template with all sections and placeholder tables
4. Save to: `Architecture/Templates/LLD/lld-platform-template.md`
5. Confirm: "Template LLD created at Architecture/Templates/LLD/lld-platform-template.md. Sections 4-7 contain placeholders for you to complete."

### Example 2: Generating LLD from Bicep Code

**User request**: "Generate an LLD from the Bicep files in ./infra/platform"

**Actions**:
1. Ask for: Project name, author, save location (e.g., Customer: contoso)
2. Glob: `./infra/platform/**/*.bicep`
3. Read all Bicep files
4. Extract:
   - VNet: vnet-hub-p-weu-001 with 10.0.0.0/16
   - Subnets: GatewaySubnet (10.0.0.0/24), AzureFirewallSubnet (10.0.1.0/24)
   - NSGs with all rules
   - Firewall configuration
   - Route tables
5. Read standards and validate names and IPs
6. Generate complete LLD with all extracted details
7. Save to: `Architecture/Customer/contoso/LLD/lld-contoso-platform.md`
8. Confirm: "LLD generated from Bicep code and saved to Architecture/Customer/contoso/LLD/lld-contoso-platform.md. Extracted 15 resources across 3 subscriptions."

### Example 3: Generating LLD from Terraform

**User request**: "Create an LLD based on the Terraform code in ./terraform/workload-app1"

**Actions**:
1. Ask for: Project name (extract from code if possible), author, save location
2. Glob: `./terraform/workload-app1/**/*.tf`
3. Read all .tf files
4. Extract:
   - Resource groups
   - Virtual network and spoke configuration
   - VNet peering to hub
   - VMs with sizes, OS, availability zones
   - Storage accounts
   - Key Vaults with private endpoints
   - NSG rules
   - RBAC assignments
5. Generate LLD with Terraform-specific deployment notes
6. Save to specified location
7. Confirm with summary of extracted resources

## Resource Extraction Patterns

### Bicep Resource Extraction

```bicep
// VNet extraction
resource vnet 'Microsoft.Network/virtualNetworks@2023-05-01' = {
  name: 'vnet-hub-p-weu-001'          // Extract: VNet name
  location: 'westeurope'               // Extract: Region
  properties: {
    addressSpace: {
      addressPrefixes: ['10.0.0.0/16'] // Extract: Address space
    }
    subnets: [                         // Extract: Subnets
      {
        name: 'GatewaySubnet'
        properties: {
          addressPrefix: '10.0.0.0/24'
        }
      }
    ]
  }
}
```

**Extract to LLD Section 4.X.4.1**:
- VNet name: vnet-hub-p-weu-001
- Address space: 10.0.0.0/16
- Region: West Europe
- Subnets table with names and prefixes

### Terraform Resource Extraction

```hcl
# VNet extraction
resource "azurerm_virtual_network" "hub" {
  name                = "vnet-hub-p-weu-001"  # Extract: VNet name
  location            = "westeurope"          # Extract: Region
  resource_group_name = azurerm_resource_group.network.name
  address_space       = ["10.0.0.0/16"]      # Extract: Address space

  tags = {                                    # Extract: Tags
    Environment = "Production"
    CostCenter  = "IT-INFRA"
  }
}

resource "azurerm_subnet" "gateway" {
  name                 = "GatewaySubnet"      # Extract: Subnet name
  resource_group_name  = azurerm_resource_group.network.name
  virtual_network_name = azurerm_virtual_network.hub.name
  address_prefixes     = ["10.0.0.0/24"]     # Extract: Subnet prefix
}
```

**Extract to LLD**:
- Section 4.X.4.1 for VNet specs
- Section 3.2 for tags
- Validate naming against naming-convention.md

### NSG Rules Extraction

```bicep
resource nsg 'Microsoft.Network/networkSecurityGroups@2023-05-01' = {
  name: 'nsg-web-p-weu-001'
  location: 'westeurope'
  properties: {
    securityRules: [
      {
        name: 'Allow-HTTPS-Inbound'
        properties: {
          priority: 100
          direction: 'Inbound'
          access: 'Allow'
          protocol: 'Tcp'
          sourceAddressPrefix: '*'
          sourcePortRange: '*'
          destinationAddressPrefix: 'VirtualNetwork'
          destinationPortRange: '443'
        }
      }
    ]
  }
}
```

**Extract to LLD Section 4.X.4.3**:
Create NSG rules table with all properties

## Validation Rules

### Naming Validation

Before finalizing the LLD, validate all resource names:

1. Check against naming-convention.md patterns
2. Verify character limits are respected
3. Ensure environment codes are correct (d, t, a, p)
4. Validate region codes (weu = West Europe)
5. Check instance numbers are formatted correctly (001, 002, etc.)

**If violations found**: Note in LLD with a warning comment and suggest corrections

### IP Addressing Validation

Validate all IP ranges against ip-addressing-scheme.md:

1. Platform subscriptions should use 10.0.0.0/16 - 10.3.0.0/16
2. Workload subscriptions should use 10.10.0.0/16 onwards
3. Non-production environments use 172.16.0.0/12
4. Each subscription has its own dedicated VNet
5. Subnet sizes are appropriate for usage

**If violations found**: Flag in LLD and note the deviation from standards

## Output Quality Standards

The generated LLD must:

1. **Be specific**: Use actual resource names, IPs, SKUs (not placeholders) when generating from code
2. **Be complete**: Include all required sections from lld-template-standard.md
3. **Be accurate**: Extracted information matches source code exactly
4. **Be compliant**: Follow naming-convention.md and ip-addressing-scheme.md
5. **Be formatted**: Proper Markdown tables, headers, code blocks
6. **Be cross-referenced**: Link to relevant standards and HLD documents
7. **Be versioned**: Include version history and change log

## Advanced Features

### Multi-Subscription LLDs

When analyzing code with multiple subscriptions:
- Create Section 4.X for each subscription
- Document dependencies between subscriptions
- Show VNet peering relationships
- Include cross-subscription RBAC if present

### Hybrid Code Analysis

If both Bicep and Terraform are present:
- Analyze both and merge into single LLD
- Note which IaC tool manages which resources
- Document in Section 5.2 (IaC table)

### Incomplete Code Handling

When code is missing critical details:
- Use placeholder: `[To be determined - not found in code]`
- Add comment suggesting where to find the information
- Mark section for manual review in confirmation message

## Troubleshooting

### Issue: IP ranges not found in code
**Solution**: Check for variables/parameters files, ask user for IP allocation, or use placeholder

### Issue: Resource naming doesn't follow standards
**Solution**: Document actual names but add note about standard deviation with suggested corrections

### Issue: Missing RBAC or Azure Policy assignments
**Solution**: Note in LLD that these may be managed at management group level or externally

### Issue: Cannot determine landing zone type from code
**Solution**: Ask user to specify the landing zone type

## Post-Generation Checklist

After generating an LLD, confirm with the user:

- [ ] LLD saved to correct location
- [ ] Filename follows convention or user preference
- [ ] All sections are present and complete (or marked as placeholders)
- [ ] Resource names validated against naming convention
- [ ] IP ranges validated against addressing scheme
- [ ] Cross-references to standards included
- [ ] Document ready for review or needs manual completion

## Summary

The lld-generator skill creates enterprise-grade Low-Level Design documentation that:
- Follows lld-template-standard.md structure rigorously
- Supports template creation for new projects
- Reverse-engineers from Bicep, Terraform, and ARM code
- Validates against naming and IP addressing standards
- Saves to appropriate project or customer directories
- Produces production-ready documentation for infrastructure implementation
