/*
 * JNCIS-ENT (JN0-352) — objective gap-coverage mock exams (G, H).
 * Focus: topics explicitly in the JN0-352 blueprint that earlier exams under-covered:
 *   - Layer 2 security: DHCP snooping, Dynamic ARP Inspection (DAI), IP source guard
 *   - Layer 2 firewall filters (types, processing order, match/actions)
 *   - Filter-based forwarding (FBF)
 *   - High availability: Virtual Chassis, Redundant Trunk Groups (RTG),
 *     Nonstop Bridging (NSB), Unified ISSU
 * Domains reuse existing ENT keys: L2, POLICY, PIR, HA (plus a few OSPF/BGP/STP items).
 * Original, scenario-based questions. No repeats of earlier ENT exams.
 * Answer positions are balanced at load by data.js.
 *
 * Appends to ENT_CERT.exams (defined in data-ent.js).
 */
(function () {
  var GAP_ENT_EXAMS = [
    // ============================================================
    {
      id: "ENT-G",
      name: "Mock Exam G — Layer 2 Security & Filters",
      description: "DHCP snooping, DAI, IP source guard, MACsec, storm control, and Layer 2 firewall filters.",
      questions: [
        { id: "G1", domain: "L2",
          text: "A rogue device on an access port is handing out DHCP leases to clients, causing wrong gateways. Which Junos feature stops untrusted ports from sending DHCP server responses?",
          options: [
            "DHCP snooping, which treats access ports as untrusted and drops server-sourced DHCP messages (OFFER/ACK) received on them",
            "Storm control",
            "Root guard",
            "MAC limiting"
          ],
          answer: 0, multi: false,
          explanation: "DHCP snooping classifies ports as trusted/untrusted; server-to-client messages (DHCPOFFER/DHCPACK) arriving on an untrusted access port are dropped, blocking a rogue DHCP server. It also builds the DHCP snooping binding table used by DAI and IP source guard." },
        { id: "G2", domain: "L2",
          text: "Dynamic ARP Inspection (DAI) validates ARP packets against which data source?",
          options: [
            "The routing table (inet.0)",
            "The DHCP snooping binding table (IP-to-MAC-to-port bindings)",
            "The MAC address table only",
            "The OSPF link-state database"
          ],
          answer: 1, multi: false,
          explanation: "DAI checks ARP packets on untrusted ports against the DHCP snooping binding database; ARPs whose IP/MAC/port do not match a valid binding are discarded, preventing ARP spoofing / man-in-the-middle attacks." },
        { id: "G3", domain: "L2",
          text: "IP source guard uses the DHCP snooping bindings to do what?",
          options: [
            "Encrypt frames on the port",
            "Filter data traffic so a port only forwards packets whose source IP (and MAC) match a valid DHCP binding",
            "Elect the root bridge",
            "Rate-limit broadcast traffic"
          ],
          answer: 1, multi: false,
          explanation: "IP source guard inspects the source IP/MAC of data frames on an access port and permits only those matching a valid DHCP snooping binding, stopping IP spoofing from that port. DAI protects ARP; IP source guard protects data-plane source addresses." },
        { id: "G4", domain: "L2",
          text: "For DHCP snooping to work correctly on a switch where the DHCP server is reached through an uplink trunk, how should that uplink be treated?",
          options: [
            "As an untrusted port",
            "As a trusted port, so legitimate server replies arriving on it are allowed",
            "Disabled for DHCP",
            "Placed in the voice VLAN"
          ],
          answer: 1, multi: false,
          explanation: "The interface toward the legitimate DHCP server (the uplink) must be trusted so server responses are permitted and bindings are learned. Access ports facing clients stay untrusted so rogue servers there are blocked." },
        { id: "G5", domain: "POLICY",
          text: "On EX switches, which firewall filter family is used to match and act on Ethernet-switched (Layer 2) traffic?",
          options: [
            "family inet",
            "family ethernet-switching",
            "family mpls",
            "family iso"
          ],
          answer: 1, multi: false,
          explanation: "Layer 2 (port/VLAN) firewall filters use 'family ethernet-switching'. family inet/inet6 are for routed IPv4/IPv6 traffic; mpls and iso are for labeled and IS-IS traffic respectively." },
        { id: "G6", domain: "POLICY",
          text: "A Layer 2 firewall filter can be bound at which of these attachment points on a switch?",
          options: [
            "Only the loopback",
            "A port (interface), a VLAN, or the switch's management interface, depending on scope",
            "Only lo0",
            "Only aggregated Ethernet interfaces"
          ],
          answer: 1, multi: false,
          explanation: "Ethernet-switching filters can be applied at a port (interface) level or a VLAN level (and management), giving different scopes. The application point (port vs VLAN) determines which traffic the filter evaluates." },
        { id: "G7", domain: "POLICY",
          text: "Within a single Junos firewall filter, two terms could match the same packet. Which term's action is applied?",
          options: [
            "The most specific term",
            "The first matching term (top-down), which stops evaluation on a terminating action",
            "Both terms' actions combined",
            "The term with the largest counter"
          ],
          answer: 1, multi: false,
          explanation: "Filters evaluate terms top-down and stop at the first term whose match succeeds and whose action is terminating (accept/discard). Term order therefore matters; a broad early term can shadow a more specific later one." },
        { id: "G8", domain: "L2",
          text: "You must ensure a Layer 2 link between two switches provides confidentiality so a tap on the fiber cannot read frames. Which feature and consideration apply?",
          options: [
            "IPsec on the SVI",
            "MACsec (802.1AE) hop-by-hop encryption on the link, keyed statically or via MKA",
            "Storm control",
            "GRE tunneling"
          ],
          answer: 1, multi: false,
          explanation: "MACsec provides Layer 2 confidentiality/integrity on the physical link between directly connected devices (keys set statically or negotiated via MKA). IPsec/GRE operate at Layer 3 and would not protect the raw L2 link the same way." },
        { id: "G9", domain: "L2",
          text: "Storm control is configured with a bandwidth-percentage level and the action 'shutdown'. What happens when broadcast traffic exceeds the level?",
          options: [
            "The excess is silently forwarded",
            "The interface is taken down (and can auto-recover if a recovery timeout is set)",
            "The VLAN is deleted",
            "Spanning tree recalculates the root"
          ],
          answer: 1, multi: false,
          explanation: "With the shutdown action, exceeding the storm-control level disables the interface to stop the storm; a configured recovery timeout can bring it back automatically. Without shutdown, storm control simply drops the excess BUM traffic." },
        { id: "G10", domain: "POLICY",
          text: "A Layer 2 firewall filter term uses 'then count rogue; then discard'. What is the effect?",
          options: [
            "It counts matching frames and then forwards them",
            "It increments a counter named 'rogue' for matching frames and drops them",
            "It rate-limits the frames",
            "It rewrites the VLAN tag"
          ],
          answer: 1, multi: false,
          explanation: "'count rogue' is a non-terminating action that increments the named counter; 'discard' is the terminating action that drops the frame. Together the term counts matches for visibility and drops them." },
        { id: "G11", domain: "L2",
          text: "Which statement about the DHCP snooping binding table is TRUE?",
          options: [
            "It stores IP-address-to-MAC-address-to-VLAN/port bindings learned from DHCP exchanges and is leveraged by DAI and IP source guard",
            "It only stores static routes",
            "It is the same as the MAC table",
            "It is built by OSPF"
          ],
          answer: 0, multi: false,
          explanation: "DHCP snooping builds a binding table (IP, MAC, VLAN, port, lease) from observed DHCP transactions. DAI and IP source guard both consult it to validate ARP and data traffic respectively." },
        { id: "G12", domain: "L2",
          text: "A phone (voice VLAN) and a PC (data VLAN) share one access port. You enable DHCP snooping. Which consideration is important?",
          options: [
            "DHCP snooping must be enabled per VLAN so both the voice and data VLANs build bindings",
            "DHCP snooping cannot coexist with voice VLANs",
            "Only the data VLAN can use snooping",
            "The port must become a trunk to the server"
          ],
          answer: 0, multi: false,
          explanation: "DHCP snooping is enabled per VLAN, so both the voice and data VLANs on that port need it configured to build bindings and protect each. It coexists with voice VLAN designs." },
        { id: "G13", domain: "POLICY",
          text: "Which match condition is available in an ethernet-switching (Layer 2) firewall filter but not in a family inet filter?",
          options: [
            "source-address (IP)",
            "source-mac-address / destination-mac-address",
            "protocol tcp",
            "destination-port"
          ],
          answer: 1, multi: false,
          explanation: "Layer 2 filters can match on MAC addresses (source/destination-mac-address) and other L2 fields. IP-oriented matches like source-address, protocol, and ports belong to family inet/inet6 filters." },
        { id: "G14", domain: "L2",
          text: "During troubleshooting you run a command to view learned DHCP bindings used by security features. Which show command is appropriate?",
          options: [
            "show dhcp-security binding (or show dhcp snooping binding, platform-dependent)",
            "show ospf neighbor",
            "show route table inet.0",
            "show isis adjacency"
          ],
          answer: 0, multi: false,
          explanation: "The DHCP snooping/security binding table is viewed with the platform's dhcp-security/snooping binding command, confirming what DAI and IP source guard will trust. The others show routing/adjacency state unrelated to L2 security." },
        { id: "G15", domain: "L2",
          text: "Which port-security threat does MAC limiting specifically address, and what is a typical action?",
          options: [
            "Root bridge takeover; action = root guard",
            "MAC/CAM table flooding; action = drop, or shutdown the port beyond the learned limit",
            "ARP spoofing; action = DAI",
            "Rogue DHCP; action = snooping"
          ],
          answer: 1, multi: false,
          explanation: "MAC limiting caps how many MACs a port learns to defend against CAM-table flooding; excess can be dropped or the port shut down. ARP spoofing and rogue DHCP are handled by DAI and DHCP snooping respectively." }
      ]
    },
    // ============================================================
    {
      id: "ENT-H",
      name: "Mock Exam H — High Availability & Filter-Based Forwarding",
      description: "Virtual Chassis, RTG, NSB/NSR/GRES, ISSU, LAG, and filter-based forwarding scenarios.",
      questions: [
        { id: "H1", domain: "HA",
          text: "Several EX switches are cabled with dedicated VCPs and managed as one logical device with a single control plane. Which technology is in use?",
          options: [
            "Redundant trunk group",
            "Virtual Chassis",
            "VRRP",
            "MACsec"
          ],
          answer: 1, multi: false,
          explanation: "Virtual Chassis interconnects multiple switches (via Virtual Chassis ports) into a single logical device with one control plane and management IP, simplifying operations and providing redundancy across members." },
        { id: "H2", domain: "HA",
          text: "In a Virtual Chassis, which role runs the active control plane and is backed up for fast failover?",
          options: [
            "Line card (LC) role",
            "Master routing-engine role (with a backup RE member ready to take over)",
            "Root bridge",
            "DIS"
          ],
          answer: 1, multi: false,
          explanation: "A VC elects a master (primary) that runs the control plane and a backup that can assume mastership on failure; other members act as line cards. GRES/NSR-like behavior across members provides continuity." },
        { id: "H3", domain: "HA",
          text: "You want a simple Layer 2 uplink redundancy on an access switch WITHOUT running spanning tree: one uplink active, the other blocking until failure. Which feature fits?",
          options: [
            "Redundant Trunk Group (RTG)",
            "VRRP",
            "Aggregated Ethernet with LACP",
            "NSR"
          ],
          answer: 0, multi: false,
          explanation: "A Redundant Trunk Group designates one link active and the other standby (blocking), failing over quickly without spanning tree — a lightweight uplink-resiliency option on access switches. LAG bundles links (both active); VRRP is a gateway feature." },
        { id: "H4", domain: "HA",
          text: "Which high-availability feature specifically preserves Layer 2 (learned MAC / protocol) state across a Routing Engine switchover?",
          options: [
            "Nonstop active routing (NSR)",
            "Nonstop bridging (NSB)",
            "VRRP",
            "Graceful restart"
          ],
          answer: 1, multi: false,
          explanation: "Nonstop bridging (NSB) synchronizes Layer 2 protocol/state (e.g., spanning-tree, MAC learning) to the backup RE so switching survives a switchover, the L2 counterpart to NSR for routing. Both build on GRES." },
        { id: "H5", domain: "HA",
          text: "A team wants to upgrade Junos on a dual-RE chassis with minimal traffic disruption, keeping protocol sessions up. Which feature combination enables this, and what underpins it?",
          options: [
            "Unified ISSU, which relies on GRES plus NSR (and NSB for bridging) to upgrade one RE while the other keeps forwarding",
            "Just rebooting both REs together",
            "VRRP failover only",
            "Storm control"
          ],
          answer: 0, multi: false,
          explanation: "Unified ISSU upgrades the software with minimal disruption by leveraging GRES (forwarding continuity) and NSR/NSB (protocol/bridging state) so neighbors do not see a flap while each RE is upgraded in turn. Platform/feature support caveats apply." },
        { id: "H6", domain: "HA",
          text: "Which statement correctly contrasts LAG and RTG for uplink redundancy?",
          options: [
            "LAG bundles multiple links into one logical link with all members active (load-shared); RTG keeps one link active and one standby",
            "They are identical",
            "RTG load-balances across both links",
            "LAG requires spanning tree to function"
          ],
          answer: 0, multi: false,
          explanation: "LAG (aggregated Ethernet, often with LACP) uses all member links simultaneously for bandwidth and redundancy; RTG uses an active/standby pair (only one forwarding). LAG does not need STP to prevent a loop on the bundle." },
        { id: "H7", domain: "PIR",
          text: "Requirement: traffic from a specific source subnet must be routed out a different next hop (a secondary ISP) regardless of the destination route in inet.0. Which Junos mechanism accomplishes this?",
          options: [
            "An aggregate route",
            "Filter-based forwarding (FBF): a firewall filter matches the source and directs matching traffic into a separate routing instance/table",
            "Root guard",
            "A generated route"
          ],
          answer: 1, multi: false,
          explanation: "Filter-based forwarding uses a firewall filter to match traffic (e.g., by source address) and set it into a specific routing-instance/table (via 'then routing-instance'), overriding the normal destination-based lookup — classic policy-based routing for source-based ISP selection." },
        { id: "H8", domain: "PIR",
          text: "In an FBF configuration, what is the role of the routing instance of type 'forwarding'?",
          options: [
            "It holds the DHCP bindings",
            "It provides a separate routing table that the matched traffic is directed to, populated (often via rib-groups) with the desired next hop",
            "It runs spanning tree",
            "It encrypts the traffic"
          ],
          answer: 1, multi: false,
          explanation: "FBF sends matched traffic to a 'forwarding' routing instance whose table contains the alternate route/next hop. Interface routes are typically shared into that table with a rib-group so the alternate path resolves correctly." },
        { id: "H9", domain: "PIR",
          text: "Which sequence correctly describes applying filter-based forwarding?",
          options: [
            "Create a forwarding instance and its table; use rib-groups to populate it; write a filter with 'then routing-instance <name>'; apply the filter to the ingress interface",
            "Configure VRRP, then apply MACsec",
            "Enable storm control and root guard",
            "Add an aggregate route and a generated route"
          ],
          answer: 0, multi: false,
          explanation: "The FBF workflow: (1) define a routing-instance of type forwarding with its routing table, (2) leak the needed routes in via a rib-group, (3) create a firewall filter term with action 'routing-instance <name>', and (4) apply that filter as input on the ingress interface." },
        { id: "H10", domain: "HA",
          text: "In a Virtual Chassis, what is the purpose of a Virtual Chassis Port (VCP)?",
          options: [
            "To connect to end hosts",
            "To interconnect member switches so they exchange control and data traffic as one logical device",
            "To peer with external BGP routers",
            "To terminate GRE tunnels"
          ],
          answer: 1, multi: false,
          explanation: "VCPs are the dedicated (or converted uplink) ports that interconnect VC members, carrying inter-member control and data traffic so the stack operates as a single logical switch." },
        { id: "H11", domain: "HA",
          text: "A LAG (ae0) between an access switch and a VC should survive the failure of any single VC member the links connect to. Which design achieves this?",
          options: [
            "Put all ae0 members on the same VC member",
            "Distribute the ae0 member links across different VC members (a multichassis-style spread within the VC)",
            "Disable LACP",
            "Use RTG instead of LAG"
          ],
          answer: 1, multi: false,
          explanation: "Spreading the LAG's member links across multiple VC members means the loss of one member (or its links) leaves the bundle up on the remaining members, maximizing resiliency. Putting all members on one switch creates a single point of failure." },
        { id: "H12", domain: "HA",
          text: "Which show command helps confirm the master/backup roles and member status of a Virtual Chassis?",
          options: [
            "show virtual-chassis status",
            "show ospf database",
            "show route forwarding-table",
            "show spanning-tree bridge"
          ],
          answer: 0, multi: false,
          explanation: "'show virtual-chassis status' displays each member's role (master/backup/linecard), ID, priority, and neighbor VCP connectivity. The others report routing, forwarding, or STP information." },
        { id: "H13", domain: "HA",
          text: "Graceful restart and NSR both aim to preserve routing across a control-plane event. Which statement distinguishes them?",
          options: [
            "Graceful restart depends on helper neighbors to keep forwarding during the restart; NSR is self-contained on a dual-RE system and needs no neighbor help",
            "They are the same feature",
            "NSR requires neighbor cooperation; graceful restart does not",
            "Graceful restart needs two REs; NSR needs only one"
          ],
          answer: 0, multi: false,
          explanation: "Graceful restart is protocol-based and relies on neighbors acting as helpers while the router restarts its control plane. NSR replicates protocol state to a backup RE locally, so neighbors are unaware of the switchover — no cooperation required." },
        { id: "H14", domain: "PIR",
          text: "After configuring FBF, matched traffic is dropped instead of using the alternate ISP. The forwarding instance and filter look correct. Which omission most commonly causes this?",
          options: [
            "Missing rib-group leaking the interface/next-hop routes into the forwarding instance's table (so the alternate next hop is unresolvable)",
            "Spanning tree is disabled",
            "MACsec is not configured",
            "The port is an access port"
          ],
          answer: 0, multi: false,
          explanation: "A very common FBF mistake is forgetting to populate the forwarding instance's table: without a rib-group importing the relevant interface/next-hop routes, the alternate next hop cannot be resolved and matched traffic is discarded." },
        { id: "H15", domain: "HA",
          text: "Which pair of features would you combine to provide gateway redundancy for hosts AND fast detection of a gateway path failure?",
          options: [
            "VRRP with BFD (or interface tracking) to speed failover",
            "RTG with MACsec",
            "NSB with storm control",
            "Virtual Chassis with DAI"
          ],
          answer: 0, multi: false,
          explanation: "VRRP presents the redundant virtual gateway; adding BFD or interface tracking lets mastership move quickly when the path fails. The other pairings mix unrelated L2-security/redundancy features that do not together deliver fast gateway failover." }
      ]
    }
  ];

  if (typeof ENT_CERT !== "undefined" && ENT_CERT && Array.isArray(ENT_CERT.exams)) {
    ENT_CERT.exams = ENT_CERT.exams.concat(GAP_ENT_EXAMS);
  }
  if (typeof module !== "undefined") { module.exports = { GAP_ENT_EXAMS: GAP_ENT_EXAMS }; }
})();
