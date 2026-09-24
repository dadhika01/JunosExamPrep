/*
 * Cheat sheet content for last-minute revision.
 * Structure: CHEATSHEET = [ { certId, certName, certCode, features: [ feature ] } ]
 * feature = {
 *   name, domain,
 *   concept  : what the feature is,
 *   motive   : why it is required,
 *   notes[]  : important values / defaults / standards to remember,
 *   flows[]  : important concepts / flows within the feature,
 *   limits[] : limitations / caveats
 * }
 * Text may contain `backtick code` which the app renders as <code>.
 * Many concepts are shared by both tracks; they appear under each cert so each
 * sheet stands on its own, with SP entries adding the provider-specific angle.
 */
var CHEATSHEET = [
  // =====================================================================
  {
    certId: "ENT", certName: "JNCIS-ENT", certCode: "JN0-352",
    features: [
      // ---------------- Layer 2 switching / VLANs ----------------
      {
        name: "Layer 2 Switching & Bridging", domain: "L2 Switching / VLANs",
        concept: "Frame forwarding based on destination MAC using a learned MAC (bridge) table; unknown-unicast/broadcast/multicast (BUM) is flooded within the VLAN.",
        motive: "Provides local, high-speed connectivity within a broadcast domain without Layer 3 lookups.",
        notes: [
          "MAC learning is dynamic; default MAC table aging timer is `300 seconds`.",
          "ELS (Enhanced Layer 2 Software) config uses `family ethernet-switching`.",
          "Frame processing: learn source MAC -> lookup destination -> forward or flood."
        ],
        flows: [
          "Access port = one untagged VLAN; trunk port = many tagged VLANs (`interface-mode access|trunk`).",
          "View table: `show ethernet-switching table`.",
          "A broadcast domain = a VLAN; flooding is contained to the VLAN."
        ],
        limits: [
          "No loop prevention on its own — requires spanning tree.",
          "MAC table size is finite; flooding attacks can overflow it (mitigate with MAC limiting)."
        ]
      },
      {
        name: "VLANs, Trunking & Native/Voice VLAN", domain: "L2 Switching / VLANs",
        concept: "A VLAN is a logical Layer 2 segment; 802.1Q adds a tag so multiple VLANs share one trunk link.",
        motive: "Segments a network into isolated broadcast domains for scalability, security, and multi-tenancy.",
        notes: [
          "802.1Q tag = `4 bytes`; VLAN ID range `1-4094` (12-bit).",
          "802.1Q EtherType = `0x8100`.",
          "Untagged frames on a trunk map to the `native VLAN` (`native-vlan-id`).",
          "Voice VLAN lets a phone (tagged) and PC (untagged) share one port."
        ],
        flows: [
          "Trunk members: `set interfaces ge-0/0/1 unit 0 family ethernet-switching vlan members [10 20]`.",
          "Inter-VLAN routing needs a Layer 3 gateway (IRB).",
          "MVRP can dynamically register/prune VLANs across trunks."
        ],
        limits: [
          "Max 4094 usable VLAN IDs per 802.1Q domain (use Q-in-Q to scale beyond).",
          "Native-VLAN mismatch between switches causes VLAN leaking / connectivity issues."
        ]
      },
      {
        name: "Integrated Routing & Bridging (IRB)", domain: "L2 Switching / VLANs",
        concept: "A logical Layer 3 interface (`irb.x`) that acts as the default gateway for a VLAN/bridge domain, enabling inter-VLAN routing.",
        motive: "Lets a single switch both bridge within VLANs and route between them without an external router.",
        notes: [
          "Associate a VLAN with its gateway via the VLAN's `l3-interface irb.x`.",
          "One IRB unit per VLAN that needs routing."
        ],
        flows: [
          "Host default gateway = the IRB address for its VLAN.",
          "Traffic between VLANs is routed by the IRB; within a VLAN it is bridged."
        ],
        limits: [
          "IRB must be up and the VLAN must have an active member for the L3 interface to be usable.",
          "An IRB down/misconfig breaks inter-VLAN routing for that segment."
        ]
      },
      // ---------------- Spanning Tree ----------------
      {
        name: "Spanning Tree (STP / RSTP / MSTP / VSTP)", domain: "Spanning Tree",
        concept: "Loop-prevention protocols that build a loop-free logical tree by blocking redundant links; RSTP converges fast, MSTP maps VLANs to few instances, VSTP is per-VLAN.",
        motive: "Prevents Layer 2 loops (broadcast storms, MAC flapping) while allowing physical redundancy.",
        notes: [
          "Bridge priority default = `32768`; must be a multiple of `4096`.",
          "Root election: lowest bridge ID (priority + MAC).",
          "RSTP port roles: root, designated, alternate, backup; states: discarding/learning/forwarding.",
          "RSTP is the Junos default variant on many platforms.",
          "VSTP interoperates with Cisco PVST+/Rapid-PVST+."
        ],
        flows: [
          "Root bridge is elected first; each non-root picks a root port (lowest path cost).",
          "RSTP uses proposal/agreement handshake for rapid convergence on point-to-point links.",
          "Choose MSTP for hundreds of VLANs (few instances); VSTP for per-VLAN topologies."
        ],
        limits: [
          "Misconfigured priorities can place the root in a bad location.",
          "VSTP does not scale to very large VLAN counts (one instance per VLAN); MSTP scales better.",
          "MSTP interoperability requires matching region name/revision/VLAN-to-instance mapping."
        ]
      },
      // ---------------- Layer 2 security ----------------
      {
        name: "STP Protections (BPDU / Loop / Root Guard)", domain: "Layer 2 Security",
        concept: "Guards that protect the spanning-tree topology: BPDU protect disables edge ports that receive BPDUs; root guard blocks superior BPDUs; loop protect stops a blocking port from wrongly forwarding.",
        motive: "Prevents rogue switches, accidental loops, and unidirectional-link failures from destabilizing the L2 topology.",
        notes: [
          "BPDU protect -> edge port that receives a BPDU is put in a blocked/error state.",
          "Root guard -> port receiving a superior BPDU goes `root-inconsistent` (blocking).",
          "Loop protect -> blocking port that stops receiving BPDUs will not move to forwarding.",
          "Recover BPDU-blocked ports with a `disable-timeout` or manual clear."
        ],
        flows: [
          "Edge/access ports: pair `edge` + `bpdu-protect`.",
          "Downstream-facing ports on the root: use `root guard`.",
          "Links prone to unidirectional failure: use `loop protect`."
        ],
        limits: [
          "BPDU protect is only appropriate on edge/host ports (never on switch-to-switch links).",
          "Guards address different threats — using the wrong one leaves a gap."
        ]
      },
      {
        name: "Port Security: MAC limiting, DHCP snooping, DAI, IP source guard", domain: "Layer 2 Security",
        concept: "Access-layer controls: MAC limiting caps learned MACs; DHCP snooping trusts only legitimate DHCP servers and builds a binding table; DAI validates ARP against it; IP source guard filters spoofed source IPs.",
        motive: "Stops CAM-table flooding, rogue DHCP servers, ARP spoofing/man-in-the-middle, and IP spoofing at the edge.",
        notes: [
          "DHCP snooping classifies ports trusted/untrusted; server ports (uplinks) must be `trusted`.",
          "The DHCP snooping binding table (IP-MAC-VLAN-port) feeds both DAI and IP source guard.",
          "DHCP snooping is enabled per-VLAN.",
          "DAI drops ARPs not matching a valid binding; IP source guard drops data with spoofed source IP/MAC."
        ],
        flows: [
          "Order of dependency: DHCP snooping builds bindings -> DAI + IP source guard consume them.",
          "MAC limiting action can be `drop` (keep port up) or `shutdown`.",
          "View bindings: `show dhcp-security binding` (platform-dependent)."
        ],
        limits: [
          "DAI / IP source guard rely on DHCP — statically addressed hosts need static bindings/exceptions.",
          "Trusting the wrong port defeats DHCP snooping entirely."
        ]
      },
      {
        name: "MACsec", domain: "Layer 2 Security",
        concept: "IEEE 802.1AE hop-by-hop Layer 2 encryption and integrity between two directly connected devices.",
        motive: "Protects data confidentiality/integrity on the physical link (e.g., against fiber taps) where L3 encryption is not enough.",
        notes: [
          "Standard: `IEEE 802.1AE`; key agreement via MKA (802.1X) or static CAK/CKN.",
          "Operates per-link (point-to-point), not end-to-end."
        ],
        flows: [
          "Configure a connectivity association with keys; apply to the interface.",
          "Frames are encrypted/authenticated as they leave and decrypted on the next hop."
        ],
        limits: [
          "Only secures a single hop — each link must be individually protected.",
          "Adds per-frame overhead; both ends must support and agree on MACsec."
        ]
      },
      {
        name: "Storm Control", domain: "Layer 2 Security",
        concept: "Rate-limits broadcast, unknown-unicast, and multicast (BUM) traffic on an interface against a configured level.",
        motive: "Contains broadcast storms so a loop or misbehaving host cannot saturate the segment.",
        notes: [
          "Level set as a bandwidth percentage or bps.",
          "Optional action `shutdown` disables the port when exceeded (auto-recover with a timeout)."
        ],
        flows: [
          "Without shutdown: excess BUM traffic is simply dropped.",
          "With shutdown: the interface is disabled until recovery."
        ],
        limits: [
          "Only affects BUM traffic, not known-unicast floods.",
          "Thresholds set too low can drop legitimate broadcast bursts."
        ]
      },
      {
        name: "Layer 2 Firewall Filters", domain: "Layer 2 Security",
        concept: "Stateless filters using `family ethernet-switching` that match L2 fields (e.g., MAC) and take actions (accept/discard/count/policer), applied to a port or VLAN.",
        motive: "Enforces L2 access control and rate-limiting where routed (family inet) filters do not apply.",
        notes: [
          "Family for L2 = `ethernet-switching`.",
          "Terms evaluated top-down; first terminating match wins; implicit discard at the end.",
          "L2-specific matches include `source-mac-address` / `destination-mac-address`."
        ],
        flows: [
          "Non-terminating actions (`count`, `log`, `policer`) can precede a terminating `accept`/`discard`.",
          "Apply at port or VLAN scope depending on the traffic you must catch."
        ],
        limits: [
          "Stateless — no session awareness.",
          "Term order matters: a broad early accept can shadow a specific later term."
        ]
      },
      // ---------------- Protocol-Independent Routing ----------------
      {
        name: "Static, Aggregate & Generated Routes; Martians", domain: "Protocol-Independent Routing",
        concept: "Protocol-independent route types: static (manual), aggregate (summary, active only with a contributor, default next hop reject), generated (summary that inherits a contributor's next hop), and martians (invalid prefixes ignored).",
        motive: "Provides deterministic routing, summarization, and safe handling of bogus prefixes without a routing protocol.",
        notes: [
          "Default route preferences: Direct/Local `0`, Static `5`, OSPF internal `10`, IS-IS L1 `15`, IS-IS L2 `18`, RIP `100`, BGP `170`.",
          "Aggregate default action = `reject`; generated route inherits primary contributor's next hop.",
          "Static next-hop `discard` = silent drop; `reject` = drop + ICMP unreachable.",
          "Example martian: `127.0.0.0/8`, `0.0.0.0/8`."
        ],
        flows: [
          "Aggregate/generated activate only when a more-specific contributing route exists.",
          "RIB groups leak routes between routing tables (e.g., into a VRF).",
          "Default IPv4 unicast table = `inet.0`; IPv6 = `inet6.0`."
        ],
        limits: [
          "Static routes do not react to topology unless tied to next-hop liveness / BFD.",
          "An aggregate with the default reject can black-hole traffic if used as a forwarding route."
        ]
      },
      {
        name: "Load Balancing & Filter-Based Forwarding", domain: "Protocol-Independent Routing",
        concept: "ECMP load balancing spreads traffic over equal-cost paths; filter-based forwarding (FBF) overrides destination-based routing by directing matched traffic into a specific routing instance.",
        motive: "Uses redundant links efficiently (load balancing) and enables policy/source-based routing (FBF).",
        notes: [
          "By default Junos installs ONE next hop even with ECMP in the RIB.",
          "Enable PFE ECMP with a policy under `routing-options forwarding-table export` (per-flow hashing).",
          "FBF uses a firewall filter action `then routing-instance <name>` to a type `forwarding` instance."
        ],
        flows: [
          "FBF workflow: create forwarding instance + table -> leak routes in via a rib-group -> filter `then routing-instance` -> apply filter as input on the ingress interface.",
          "Load-balance policy is applied to the forwarding table, not as a protocol import policy."
        ],
        limits: [
          "Without the forwarding-table export policy, ECMP is not programmed in hardware.",
          "FBF fails (drops) if the forwarding instance's table lacks the resolving route (missing rib-group)."
        ]
      },
      // ---------------- OSPF ----------------
      {
        name: "OSPF", domain: "OSPF",
        concept: "Link-state IGP: routers flood LSAs to build an identical link-state database, then run Dijkstra (SPF) to compute shortest paths within an area.",
        motive: "Fast-converging, scalable interior routing with hierarchical areas.",
        notes: [
          "Junos default reference bandwidth = `100 Mbps` (cost = ref / interface bw, min 1).",
          "Default hello `10s` (broadcast) / dead `40s`; they must match to form adjacency.",
          "LSA types: 1 Router, 2 Network, 3 Summary, 4 ASBR-summary, 5 External, 7 NSSA-external.",
          "Backbone = area `0`; all areas must attach to it (or via a virtual link).",
          "OSPFv3 routes IPv6 (per-link, uses link-local); still needs a 32-bit Router ID."
        ],
        flows: [
          "Adjacency states: Down -> Init -> 2-Way -> ExStart -> Exchange -> Loading -> Full.",
          "DR/BDR elected on broadcast/NBMA (highest priority, then Router ID); priority 0 = ineligible.",
          "Area types: stub (no externals), totally stubby (default only), NSSA (local Type 7)."
        ],
        limits: [
          "Adjacency stuck in ExStart/Exchange usually = MTU mismatch.",
          "All areas must touch area 0 — discontiguous backbones need virtual links.",
          "Reference bandwidth must be consistent network-wide or costs are inconsistent."
        ]
      },
      // ---------------- IS-IS ----------------
      {
        name: "IS-IS", domain: "IS-IS",
        concept: "Link-state IGP that runs directly over Layer 2 (CLNS) and carries IPv4/IPv6 reachability in TLVs; uses Level 1 (intra-area) and Level 2 (backbone).",
        motive: "Robust, extensible IGP widely used in large enterprise/SP cores; TLVs make it multi-protocol.",
        notes: [
          "Default interface metric = `10` (not bandwidth-derived).",
          "Narrow metric max = `63`; wide metrics needed for larger values / TE.",
          "NET = area + 6-byte system ID + NSEL (`00`), e.g., `49.0001.1921.6800.1001.00`.",
          "PDUs: IIH (hello), LSP, CSNP, PSNP.",
          "L1 adjacency requires same area; L2 forms across areas."
        ],
        flows: [
          "DIS elected on broadcast LANs (highest priority, then MAC) and creates the pseudonode LSP; no backup DIS.",
          "CSNP/PSNP synchronize the LSP database.",
          "Overload bit -> avoid using this node for transit while keeping its connected routes."
        ],
        limits: [
          "Narrow metrics cap per-link at 63 (enable wide metrics to exceed).",
          "DIS has no backup — it can be preempted, causing brief churn."
        ]
      },
      // ---------------- BGP ----------------
      {
        name: "BGP", domain: "BGP",
        concept: "Path-vector EGP that exchanges reachability plus path attributes between autonomous systems (EBGP) and within one (IBGP), selecting a single best path.",
        motive: "Scalable inter-domain and policy-rich routing where IGPs do not fit (internet edge, large enterprises).",
        notes: [
          "TCP port `179`; message types: Open, Update, Keepalive, Notification.",
          "Default hold time `90s`, keepalive `30s`.",
          "Junos path selection: highest Local-Pref -> shortest AS-path -> lowest Origin (IGP<EGP<Incomplete) -> lowest MED -> EBGP over IBGP -> lowest IGP cost to next hop.",
          "Well-known communities: `no-export`, `no-advertise`.",
          "EBGP default TTL = 1 (multihop needed for non-adjacent/loopback peering)."
        ],
        flows: [
          "IBGP split-horizon: a route from one IBGP peer is NOT re-advertised to another IBGP peer.",
          "Scale IBGP with route reflectors (loop prevention via ORIGINATOR_ID + CLUSTER_LIST) or confederations.",
          "Local-pref = outbound preference (within AS); MED = hint to a neighbor AS for inbound.",
          "Junos infers EBGP vs IBGP from peer-as vs local-as."
        ],
        limits: [
          "Slow default convergence (timers) — pair with BFD for speed.",
          "IBGP full mesh does not scale (n(n-1)/2 sessions).",
          "MED is only comparable between routes from the same neighboring AS by default."
        ]
      },
      {
        name: "Routing Policy & Firewall Filters (Layer 3)", domain: "Policy / Filters",
        concept: "Routing policy controls which routes are imported/exported and how attributes are set; firewall filters (family inet/inet6) match packet fields and take actions.",
        motive: "Implements route control (redistribution, filtering, attribute manipulation) and traffic control / RE protection.",
        notes: [
          "Policy terms: match with `from`, act with `then`; a matching term with no terminating action falls through.",
          "Default BGP policy = accept received / advertise active BGP; OSPF/IS-IS do not import externals by default.",
          "Firewall filters evaluate top-down, first terminating match wins, implicit discard at the end.",
          "Policer = `bandwidth-limit` + `burst-size-limit` + action (discard/mark)."
        ],
        flows: [
          "Redistribution into an IGP = an export policy matching the source protocol + prefixes.",
          "Protect the RE with an `lo0` filter that permits required control protocols then discards the rest.",
          "route-filter modifiers: `exact`, `orlonger`, `upto`, `through`."
        ],
        limits: [
          "Firewall filters are stateless.",
          "An lo0 filter missing a required protocol term will break that protocol (e.g., OSPF adjacency)."
        ]
      },
      // ---------------- Tunnels ----------------
      {
        name: "IP Tunnels (GRE / IP-IP)", domain: "Tunnels",
        concept: "Encapsulation that carries one protocol inside another across an intermediate network; GRE (`gr-`) can carry many protocols, IP-IP (`ip-`) carries IP-in-IP.",
        motive: "Connects separated networks (e.g., IPv6 islands over IPv4) or overlays a path independent of the underlay.",
        notes: [
          "GRE interface = `gr-`; IP-IP interface = `ip-`; both need tunnel services.",
          "Neither GRE nor IP-IP is encrypted.",
          "Encapsulation overhead lowers effective MTU."
        ],
        flows: [
          "Define tunnel source/destination; route traffic into the tunnel interface.",
          "Use PMTUD or TCP MSS clamping / lower tunnel MTU to avoid fragmentation/black-holing."
        ],
        limits: [
          "No confidentiality (add IPsec if needed).",
          "MTU/fragmentation issues are the most common operational problem.",
          "Tunnel state depends on underlay reachability to the far endpoint."
        ]
      },
      // ---------------- High Availability ----------------
      {
        name: "High Availability (GRES / NSR / NSB / GR / ISSU)", domain: "High Availability",
        concept: "Control-plane resiliency: GRES preserves kernel/forwarding state on RE switchover; NSR preserves routing-protocol state; NSB preserves Layer 2 state; graceful restart uses helper neighbors; unified ISSU upgrades with minimal disruption.",
        motive: "Keeps forwarding and neighbor sessions up during RE failover and software upgrades.",
        notes: [
          "NSR and NSB both build on GRES.",
          "GRES alone does NOT preserve routing adjacencies.",
          "Graceful restart depends on helper neighbors; NSR does not.",
          "Unified ISSU relies on GRES + NSR (and NSB)."
        ],
        flows: [
          "Planned upgrade with no flap: GRES + NSR (+ NSB) enabling ISSU.",
          "Dual-RE switchover: GRES for forwarding, NSR/NSB for protocol/L2 continuity."
        ],
        limits: [
          "ISSU has platform/feature support caveats.",
          "Graceful restart needs cooperating neighbors; if they do not help, sessions still drop."
        ]
      },
      {
        name: "LAG, RTG & Virtual Chassis", domain: "High Availability",
        concept: "Link/chassis redundancy: LAG (`ae`) bundles links (LACP) with all members active; RTG provides active/standby uplinks without STP; Virtual Chassis makes multiple switches one logical device.",
        motive: "Increases bandwidth and provides fast, simple redundancy for links and devices.",
        notes: [
          "LAG = aggregated Ethernet `aeX`; LACP negotiates/monitors members (all active).",
          "RTG = one active + one standby (blocking) uplink; failover without spanning tree.",
          "Virtual Chassis: members connect via VCPs; roles master/backup/linecard."
        ],
        flows: [
          "Spread LAG members across VC members for resiliency.",
          "Use RTG on access switches for lightweight uplink redundancy.",
          "`show virtual-chassis status` shows member roles/connectivity."
        ],
        limits: [
          "RTG carries traffic on only one link at a time (no load sharing).",
          "LAG members must have matching properties or they stay detached.",
          "Virtual Chassis shares a control plane — a control-plane issue can affect the stack."
        ]
      },
      {
        name: "VRRP & BFD", domain: "High Availability",
        concept: "VRRP presents a virtual gateway IP shared by routers for first-hop redundancy; BFD provides lightweight sub-second failure detection between neighbors.",
        motive: "Gives hosts a resilient default gateway (VRRP) and speeds protocol convergence (BFD).",
        notes: [
          "VRRP master = highest priority (tie -> highest interface IP).",
          "BFD detection time ~= `interval x multiplier` (e.g., 300ms x 3 = 900ms).",
          "VRRP interface/route tracking lowers priority on uplink failure to trigger failover."
        ],
        flows: [
          "VRRP master forwards for the virtual IP; backup takes over on failure.",
          "BFD signals OSPF/IS-IS/BGP to tear down immediately when a path fails."
        ],
        limits: [
          "VRRP alone reacts on its own timers unless paired with tracking/BFD.",
          "Aggressive BFD timers can cause false positives on unstable links."
        ]
      }
    ]
  },
  // =====================================================================
  {
    certId: "SP", certName: "JNCIS-SP", certCode: "JN0-364",
    features: [
      {
        name: "Protocol-Independent Routing", domain: "Protocol-Independent Routing",
        concept: "Static, aggregate, generated routes, martians, RIB groups, load balancing, and filter-based forwarding — independent of any routing protocol.",
        motive: "Deterministic routing, summarization, table leaking, and policy-based forwarding in provider networks.",
        notes: [
          "Static preference `5`; aggregate default next hop = `reject`; generated inherits contributor next hop.",
          "MPLS/tunnel egress next hops live in `inet.3`; IPv4 unicast in `inet.0`; labels in `mpls.0`.",
          "RSVP route preference `7` < LDP `9` (RSVP preferred in inet.3 by default)."
        ],
        flows: [
          "BGP next hops resolve against inet.3 (over an LSP) at the ingress PE.",
          "FBF: match traffic -> `then routing-instance` (type forwarding) -> populate its table via rib-group.",
          "Enable PFE ECMP via `routing-options forwarding-table export` load-balance policy."
        ],
        limits: [
          "ECMP not in hardware without the forwarding-table export policy.",
          "FBF drops matched traffic if the forwarding table lacks a resolving route."
        ]
      },
      {
        name: "OSPF / OSPFv3", domain: "OSPF",
        concept: "Link-state IGP building an LSDB and running SPF; OSPFv3 carries IPv6.",
        motive: "Interior reachability and, in SP, the underlay that LSPs/BGP next hops resolve over.",
        notes: [
          "Default reference bandwidth `100 Mbps`; hello `10s`/dead `40s` (broadcast).",
          "LSA types 1-5 (+7 for NSSA); backbone area `0`.",
          "OSPFv3 runs per-link, uses link-local, still needs a 32-bit Router ID."
        ],
        flows: [
          "DR/BDR on broadcast (priority then Router ID); no DR on point-to-point.",
          "ABR summarizes with `area-range`; virtual links repair a discontiguous backbone."
        ],
        limits: [
          "ExStart/Exchange stuck = MTU mismatch.",
          "Inconsistent reference bandwidth -> inconsistent costs."
        ]
      },
      {
        name: "IS-IS", domain: "IS-IS",
        concept: "Layer-2-based link-state IGP using TLVs; Levels 1 (area) and 2 (backbone). Very common in SP cores and the basis for SR-MPLS SID flooding.",
        motive: "Scalable, extensible IGP; TLVs enable multi-topology IPv4/IPv6 and segment-routing extensions.",
        notes: [
          "Default metric `10`; narrow max `63`; enable wide metrics for larger values / TE / SR.",
          "PDUs: IIH, LSP, CSNP, PSNP; DIS creates the pseudonode LSP (no backup DIS).",
          "Multi-topology IS-IS separates IPv4 and IPv6 topologies."
        ],
        flows: [
          "L1 adjacency = same area; L2 across areas.",
          "Overload bit avoids transit while keeping connected routes (maintenance).",
          "SR extensions (IS-IS sub-TLVs) advertise prefix/adjacency SIDs and the SRGB."
        ],
        limits: [
          "Narrow metrics limit TE (use wide metrics).",
          "Single-topology IS-IS assumes IPv4/IPv6 share a topology — breaks with family-specific links."
        ]
      },
      {
        name: "BGP", domain: "BGP",
        concept: "Path-vector protocol carrying internet and VPN reachability with rich attributes; EBGP between ASes, IBGP within.",
        motive: "Inter-domain routing and (via MP-BGP) the control plane for L3VPN/6PE and IPv6.",
        notes: [
          "TCP `179`; hold `90s`/keepalive `30s`; EBGP default TTL 1.",
          "Selection: Local-Pref -> AS-path -> Origin -> MED -> EBGP>IBGP -> IGP cost.",
          "Address families: `inet` (IPv4), `inet6` (IPv6), `inet-vpn` (VPNv4), `l2vpn`.",
          "Route reflection loop prevention: ORIGINATOR_ID + CLUSTER_LIST."
        ],
        flows: [
          "IBGP split-horizon requires full mesh, route reflectors, or confederations.",
          "MP-BGP inet-vpn carries RD-qualified VPNv4 routes between PEs.",
          "6PE advertises labeled IPv6 over an IPv4/MPLS core."
        ],
        limits: [
          "IBGP full mesh does not scale.",
          "Next hop must be resolvable (use next-hop self or IGP/LSP reachability)."
        ]
      },
      {
        name: "Layer 2 Bridging, VLANs & Provider Bridging (Q-in-Q)", domain: "Layer 2 / VLANs",
        concept: "SP-platform bridging (MX): bridge domains, virtual switches, IRB, flexible VLAN tagging, and 802.1ad provider bridging (Q-in-Q) that stacks an S-tag over the customer C-tag.",
        motive: "Delivers scalable multi-tenant Layer 2 services and transports overlapping customer VLANs across a shared core.",
        notes: [
          "Q-in-Q outer S-tag EtherType = `0x88a8` (802.1ad); customer 802.1Q = `0x8100`.",
          "A `virtual-switch` instance = isolated bridge domains + MAC tables.",
          "`flexible-vlan-tagging` + `flexible-ethernet-services` = many tagged units per port.",
          "Bridge domain on MX is analogous to a VLAN."
        ],
        flows: [
          "Provider edge pushes the S-tag (preserving inner C-tag), far edge pops it.",
          "Virtual switches isolate customers with overlapping VLAN IDs on one platform."
        ],
        limits: [
          "802.1Q alone caps at 4094 VLANs — Q-in-Q needed to scale customer VLANs.",
          "Tag handling / EtherType mismatches break provider-bridged services."
        ]
      },
      {
        name: "Spanning-Tree Protocols", domain: "Spanning Tree",
        concept: "STP/RSTP/MSTP/VSTP loop prevention plus BPDU/loop/root protection, applied in SP access/aggregation designs.",
        motive: "Loop-free redundant Layer 2 in provider access rings and aggregation.",
        notes: [
          "Bridge priority default `32768` (multiple of 4096); RSTP is the common default variant.",
          "BPDU protect blocks edge ports that receive BPDUs; root guard enforces root position."
        ],
        flows: [
          "MSTP maps many VLANs to few instances for scale; VSTP is per-VLAN (Cisco interop).",
          "Protect access ports with edge + BPDU protect."
        ],
        limits: [
          "VSTP scaling is limited; MSTP needs matching region config to interoperate."
        ]
      },
      {
        name: "MPLS Fundamentals & Forwarding", domain: "MPLS",
        concept: "Labels (a 32-bit shim) are pushed/swapped/popped to forward packets along Label-Switched Paths independent of the IP header; ingress LER imposes, transit LSR swaps, egress pops.",
        motive: "Fast, protocol-independent forwarding and the foundation for TE, VPNs, and fast reroute.",
        notes: [
          "Shim header: 20-bit label, 3-bit EXP/Traffic-Class (CoS), 1-bit S (bottom of stack), 8-bit TTL.",
          "Reserved labels: `0` explicit-null, `3` implicit-null (PHP).",
          "`inet.3` = LSP egress next hops (ingress resolution); `mpls.0` = transit swap/pop entries.",
          "Enable labeled forwarding on core interfaces with `family mpls`."
        ],
        flows: [
          "FEC = set of packets forwarded the same way (mapped to a label at ingress).",
          "PHP: penultimate LSR pops so egress does a single lookup (advertised via implicit-null).",
          "TTL propagate vs no-propagate controls whether traceroute reveals core hops."
        ],
        limits: [
          "Missing `family mpls` on a core interface breaks label forwarding.",
          "Loopbacks must be /32 for host LSPs (LDP) to build."
        ]
      },
      {
        name: "LDP, RSVP-TE & Segment Routing (SR-MPLS)", domain: "MPLS",
        concept: "Label-distribution options: LDP follows the IGP shortest path (no TE); RSVP-TE signals explicit, bandwidth-reserved LSPs with fast reroute; SR-MPLS distributes SIDs in the IGP so paths are source-routed with no per-LSP state.",
        motive: "Choose simplicity (LDP), traffic engineering/guarantees (RSVP-TE), or scalable stateless TE (SR).",
        notes: [
          "LDP = IGP-following, no bandwidth reservation; RSVP-TE = ERO + bandwidth + FRR.",
          "SR: node/prefix SID is global (from the SRGB); adjacency SID is local to a router.",
          "SRGB = reserved, network-wide MPLS label range for prefix SIDs.",
          "SR uses OSPF/IS-IS extensions to flood SIDs — no LDP/RSVP needed for label distribution."
        ],
        flows: [
          "RSVP FRR pre-signals bypass/detour LSPs for ~50 ms local repair.",
          "SR explicit path = an ordered stack of SIDs in the packet (no midpoint state).",
          "By default RSVP (pref 7) is preferred over LDP (pref 9) in inet.3."
        ],
        limits: [
          "RSVP-TE holds per-LSP soft state at every hop (scaling cost); SR removes this.",
          "SR requires IGP SR extensions and a consistent SRGB across the domain."
        ]
      },
      {
        name: "MPLS VPNs (L3VPN / L2VPN / VPLS)", domain: "MPLS VPNs",
        concept: "Provider VPN services over MPLS: RFC 4364 L3VPN (routed, VPNv4 via MP-BGP), point-to-point L2 circuits/L2VPN pseudowires, and VPLS (multipoint Ethernet LAN emulation). [Bonus depth beyond the current JN0-364 core.]",
        motive: "Deliver isolated customer routing/switching over a shared core with scalable control plane.",
        notes: [
          "Route Distinguisher (RD) makes overlapping prefixes unique (VPNv4); Route Target (RT) controls VRF import/export.",
          "L3VPN uses a two-label stack: outer transport label + inner VPN label.",
          "PE VRF = routing-instance type `vrf`; VPLS = type `vpls`.",
          "L2 circuit (Martini/LDP) vs L2VPN (Kompella/BGP auto-discovery)."
        ],
        flows: [
          "PE-CE routes -> vrf-export (with RT) -> MP-BGP VPNv4 -> remote PE vrf-import.",
          "Routes in `bgp.l3vpn.0` but not the VRF = RT import mismatch.",
          "Site-of-Origin (SoO) prevents loops for multihomed sites; hub-and-spoke uses asymmetric RTs."
        ],
        limits: [
          "Requires an MPLS core and MP-BGP (full mesh or route reflectors supporting inet-vpn).",
          "Misaligned RTs silently break VPN connectivity even when BGP is up."
        ]
      },
      {
        name: "IPv6", domain: "IPv6",
        concept: "128-bit addressing with static and dynamic routing (OSPFv3, IS-IS, BGP inet6) and IPv6-over-IPv4 transport options.",
        motive: "Address exhaustion and modern service delivery; SP cores must transport IPv6 alongside IPv4.",
        notes: [
          "Address = 128 bits; typical SLAAC split = 64-bit prefix + 64-bit interface ID.",
          "Link-local `FE80::/10`; ULA `FC00::/7` (commonly FD00::/8); global `2000::/3`; multicast `FF00::/8`.",
          "Neighbor Discovery (NS/NA) replaces ARP; RS/RA for router/prefix discovery; SLAAC autoconfigures.",
          "BGP IPv6 = `inet6` family; over IPv4/MPLS core use 6PE."
        ],
        flows: [
          "Static route with a link-local next hop must specify the outgoing interface.",
          "IS-IS carries IPv6 in TLVs (single- or multi-topology); OSPFv3 for OSPF-based IPv6."
        ],
        limits: [
          "Link-local next hops are interface-scoped (ambiguous without the interface).",
          "6PE requires an MPLS core; native dual-stack requires IPv6 on all core devices."
        ]
      },
      {
        name: "Tunnels (GRE) & IPv6-over-IPv4", domain: "Tunnels",
        concept: "GRE (`gr-`) encapsulation to connect networks across an intermediate transport, including carrying IPv6 across an IPv4-only core.",
        motive: "Join separated sites/islands or overlay connectivity without changing the underlay.",
        notes: [
          "GRE interface = `gr-` (tunnel services required); GRE is not encrypted.",
          "Encapsulation overhead reduces effective MTU."
        ],
        flows: [
          "Set tunnel source/destination; route IPv6 across the GRE tunnel for IPv6-over-IPv4.",
          "Mitigate MTU issues with MSS clamping / lower tunnel MTU / PMTUD."
        ],
        limits: [
          "No confidentiality (layer IPsec on top if required).",
          "Fragmentation/black-holing of large packets is the common pitfall."
        ]
      },
      {
        name: "High Availability (GR / GRES / NSB / NSR / BFD / VRRP / LAG)", domain: "High Availability",
        concept: "Control-plane and link resiliency: GRES (kernel/forwarding), NSR (routing state), NSB (Layer 2 state), graceful restart (helper-based), BFD (fast detection), VRRP (gateway), LAG (link bundling).",
        motive: "Maintain forwarding and sessions through RE switchovers and link failures in always-on SP networks.",
        notes: [
          "NSR and NSB build on GRES; GRES alone does not keep adjacencies up.",
          "Graceful restart depends on helper neighbors; NSR does not.",
          "BFD detection ~= interval x multiplier; VRRP master = highest priority.",
          "LAG (`ae`) with LACP — all members active; verify matching member properties."
        ],
        flows: [
          "Non-stop through switchover: GRES + NSR (+ NSB for bridging).",
          "Fast IGP/BGP failure detection: enable BFD on the adjacency.",
          "Gateway redundancy with fast failover: VRRP + tracking/BFD."
        ],
        limits: [
          "Graceful restart needs cooperating neighbors.",
          "Aggressive BFD timers risk false positives; VRRP without tracking reacts only on its own timers."
        ]
      }
    ]
  }
];

if (typeof module !== "undefined") { module.exports = { CHEATSHEET: CHEATSHEET }; }
