/*
 * JNCIS-SP (JN0-364) — objective gap-coverage mock exams (G, H).
 * Focus: topics explicitly in the current JN0-364 blueprint (Junos 25.2) that
 * earlier exams under-covered:
 *   - Segment Routing with MPLS (SR-MPLS): SIDs, SRGB, node/adjacency SIDs, IGP flooding
 *   - MPLS packet flow / label information base / MPLS + routing tables (deeper)
 *   - Provider bridging (Q-in-Q tunneling) and virtual switches
 *   - IPv6 over IPv4 tunneling (GRE); IPv6 dynamic routing (OSPFv3/IS-IS/BGP)
 *   - High availability: Nonstop bridging (NSB), LAG, GR/GRES/NSR, BFD, VRRP
 * Domains reuse existing SP keys: MPLS, L2, IPV6, TUNNELS, HA (plus OSPF/ISIS/BGP).
 * Original, scenario-based questions. No repeats of earlier SP exams.
 * Answer positions are balanced at load by data.js.
 *
 * Appends to SP_CERT.exams (defined in data-sp.js).
 */
(function () {
  var GAP_SP_EXAMS = [
    // ============================================================
    {
      id: "SP-G",
      name: "Mock Exam G — Segment Routing, MPLS & Provider Bridging",
      description: "SR-MPLS (SIDs, SRGB, node/adjacency SIDs), MPLS forwarding details, and Q-in-Q / virtual switches.",
      questions: [
        { id: "G1", domain: "MPLS",
          text: "In Segment Routing with MPLS (SR-MPLS), how are the label-switched paths signaled through the network?",
          options: [
            "By RSVP with per-LSP soft state at every hop",
            "By the IGP (OSPF/IS-IS) advertising segment identifiers (SIDs) as MPLS labels — no LDP or RSVP signaling needed",
            "By LDP only",
            "By BGP flow-spec"
          ],
          answer: 1, multi: false,
          explanation: "SR-MPLS uses the IGP to distribute SIDs (encoded as MPLS labels) so paths are computed and instantiated without a separate label-distribution protocol. Removing per-LSP state from LDP/RSVP is a core benefit of segment routing." },
        { id: "G2", domain: "MPLS",
          text: "What does the Segment Routing Global Block (SRGB) define?",
          options: [
            "A range of TCP ports for signaling",
            "A reserved, network-wide range of MPLS label values from which node (prefix) SIDs are allocated",
            "The maximum LSP bandwidth",
            "The set of VLANs in a virtual switch"
          ],
          answer: 1, multi: false,
          explanation: "The SRGB is a reserved label range shared across the domain; a node/prefix SID is expressed as an index that each router adds to its SRGB base to derive the actual local label. A consistent SRGB simplifies operations." },
        { id: "G3", domain: "MPLS",
          text: "A prefix (node) SID and an adjacency SID differ in what fundamental way?",
          options: [
            "A node SID is globally significant and identifies a prefix/node; an adjacency SID is locally significant and identifies a specific link/adjacency",
            "They are identical",
            "A node SID is local; an adjacency SID is global",
            "Both are allocated by RSVP"
          ],
          answer: 0, multi: false,
          explanation: "A prefix/node SID is a global segment (reachability to a node/prefix, drawn from the SRGB); an adjacency SID is local to the advertising router and steers traffic over a specific adjacency/link. Stacking these SIDs builds an explicit path." },
        { id: "G4", domain: "MPLS",
          text: "Which is a stated advantage of SR-MPLS over RSVP-TE for traffic engineering?",
          options: [
            "It requires more protocol state in the core",
            "It removes per-LSP signaling state from midpoint routers (state is carried in the packet's label stack), improving scalability",
            "It cannot do explicit paths",
            "It needs LDP as well"
          ],
          answer: 1, multi: false,
          explanation: "In SR, the explicit path is encoded as a stack of SIDs in the packet header, so transit routers hold no per-LSP state — a key scalability advantage over RSVP-TE, which maintains soft state per LSP at every hop." },
        { id: "G5", domain: "L2",
          text: "A service provider must carry many customers' VLANs across a shared backbone while keeping each customer's VLAN space independent. Which technique adds a provider (outer) tag over the customer (inner) tag?",
          options: [
            "MACsec",
            "Provider bridging / Q-in-Q (802.1ad) tunneling with an S-VLAN (outer) tag over the C-VLAN (inner) tag",
            "GRE",
            "VRRP"
          ],
          answer: 1, multi: false,
          explanation: "Q-in-Q (802.1ad provider bridging) pushes a service-provider S-tag outside the customer's C-tag, so customer VLAN IDs can overlap yet remain isolated by the outer tag across the provider backbone." },
        { id: "G6", domain: "L2",
          text: "On an MX router, a 'virtual switch' routing instance is used to do what?",
          options: [
            "Run BGP for a customer",
            "Provide an isolated Layer 2 bridging domain (or set of bridge domains/VLANs) with its own MAC learning, separate from other instances",
            "Terminate GRE tunnels",
            "Reserve MPLS bandwidth"
          ],
          answer: 1, multi: false,
          explanation: "A virtual-switch instance type gives an isolated L2 environment — its own bridge domains, VLANs, and MAC tables — allowing multiple independent switching contexts on one MX, useful for multi-tenant provider bridging." },
        { id: "G7", domain: "MPLS",
          text: "Which Junos routing table primarily holds the label-switching operations (incoming label to swap/pop plus next hop) for transit SR-MPLS or LDP/RSVP traffic?",
          options: [
            "inet.0",
            "mpls.0",
            "inet.3",
            "bgp.l3vpn.0"
          ],
          answer: 1, multi: false,
          explanation: "mpls.0 contains the transit label operations (swap/pop with next hop) regardless of how the labels were programmed (SR IGP, LDP, or RSVP). inet.3 holds LSP egress next hops for ingress BGP resolution; inet.0 is IPv4 unicast." },
        { id: "G8", domain: "L2",
          text: "In Q-in-Q, what is the typical EtherType of the outer service-provider (S-VLAN) tag defined by 802.1ad?",
          options: [
            "0x0800",
            "0x88a8",
            "0x8100",
            "0x8847"
          ],
          answer: 1, multi: false,
          explanation: "802.1ad provider bridging uses EtherType 0x88a8 for the outer S-tag, distinguishing it from the customer 0x8100 (802.1Q) C-tag. 0x0800 is IPv4 and 0x8847 is MPLS unicast." },
        { id: "G9", domain: "MPLS",
          text: "In the MPLS forwarding process, what does an ingress LSR (label edge router) do to an unlabeled packet entering the MPLS domain?",
          options: [
            "It pops a label",
            "It classifies the packet into a FEC and pushes the appropriate label (imposition)",
            "It swaps two labels",
            "It floods it to all interfaces"
          ],
          answer: 1, multi: false,
          explanation: "The ingress LER performs label imposition: it maps the packet to a Forwarding Equivalence Class and pushes the label(s) for the LSP. Transit LSRs swap labels; the egress pops (or PHP happens at the penultimate hop)." },
        { id: "G10", domain: "MPLS",
          text: "With SR-MPLS, how is an explicit (traffic-engineered) path expressed in the packet itself?",
          options: [
            "As a single label only",
            "As an ordered stack of SIDs (labels) that the packet traverses segment by segment",
            "As a VLAN tag list",
            "As a BGP community"
          ],
          answer: 1, multi: false,
          explanation: "The head-end encodes the explicit path as an ordered label stack of SIDs; each segment is consumed as the packet is forwarded, so the path is source-routed without midpoint LSP state." },
        { id: "G11", domain: "L2",
          text: "When a provider-bridging (Q-in-Q) interface receives a customer frame, which action correctly describes normal S-tag handling at the provider edge?",
          options: [
            "Strip all tags and forward untagged",
            "Push (add) the provider S-VLAN tag while preserving the customer's inner C-tag(s)",
            "Rewrite the customer MAC",
            "Encrypt the frame"
          ],
          answer: 1, multi: false,
          explanation: "At the provider edge the S-tag is pushed on top of the existing customer tag(s); the inner C-tag is preserved and transported transparently, then the S-tag is popped at the far provider edge." },
        { id: "G12", domain: "MPLS",
          text: "Which IGP extensions carry segment routing information such as prefix-SIDs and the SRGB?",
          options: [
            "OSPF and IS-IS extensions (e.g., IS-IS SR sub-TLVs / OSPF extended prefix/link opaque LSAs)",
            "RIP TLVs",
            "STP BPDUs",
            "ARP options"
          ],
          answer: 0, multi: false,
          explanation: "Segment routing relies on IGP extensions — IS-IS SR sub-TLVs and OSPF extended prefix/link (opaque) LSAs — to advertise prefix/node SIDs, adjacency SIDs, and the SRGB throughout the domain." },
        { id: "G13", domain: "MPLS",
          text: "The 'label information base' (LIB) on an LSR is best described as what?",
          options: [
            "The table of learned MAC addresses",
            "The set of label bindings the LSR knows (label-to-FEC/next-hop mappings) from which forwarding entries are derived",
            "The BGP RIB-in",
            "The DHCP binding table"
          ],
          answer: 1, multi: false,
          explanation: "The LIB holds all label bindings the LSR has learned (per FEC/next hop); the active subset is programmed into the label forwarding table (mpls.0 / LFIB) actually used to switch packets." },
        { id: "G14", domain: "L2",
          text: "Why might a provider deploy multiple virtual switches on a single MX instead of one large bridge domain set?",
          options: [
            "To reduce the number of physical ports",
            "To isolate customers/services into separate L2 contexts with independent MAC learning and VLAN spaces, improving scalability and security",
            "To disable spanning tree",
            "To avoid using MPLS"
          ],
          answer: 1, multi: false,
          explanation: "Separate virtual switches give each customer/service its own isolated bridging context (MAC tables, VLAN space, spanning-tree instances), which improves multi-tenancy isolation, overlapping-VLAN support, and scale on one platform." },
        { id: "G15", domain: "MPLS",
          text: "A benefit of segment routing frequently cited for large SP cores is simplified operations because it eliminates which protocols for basic label distribution?",
          options: [
            "OSPF and IS-IS",
            "LDP and RSVP (their label-distribution role is taken over by IGP SID advertisement)",
            "BGP and VRRP",
            "ARP and DHCP"
          ],
          answer: 1, multi: false,
          explanation: "By distributing labels (SIDs) within the IGP, SR-MPLS removes the need for separate LDP/RSVP label-distribution protocols and their per-LSP state, simplifying the control plane. The IGP itself (OSPF/IS-IS) is still required." }
      ]
    },
    // ============================================================
    {
      id: "SP-H",
      name: "Mock Exam H — IPv6, Tunneling & High Availability",
      description: "IPv6 static/dynamic routing, IPv6-over-IPv4 GRE tunneling, and HA (LAG, NSB, GR/GRES/NSR, BFD, VRRP).",
      questions: [
        { id: "H1", domain: "IPV6",
          text: "You must run a dynamic IGP for IPv6 across the core and prefer a link-state protocol that can also still carry IPv4 in the same process. Which choice fits, and how does it handle the two families?",
          options: [
            "OSPFv2, which natively carries IPv6",
            "IS-IS, which can carry both IPv4 and IPv6 reachability via TLVs (single- or multi-topology) in one instance",
            "RIP, the only IPv6 IGP",
            "BGP only; no IGP supports IPv6"
          ],
          answer: 1, multi: false,
          explanation: "IS-IS runs over Layer 2 and carries IPv4 and IPv6 reachability in separate TLVs within one instance (single-topology if the topologies match, multi-topology if they differ). OSPFv2 is IPv4-only; OSPFv3 is the IPv6 OSPF variant." },
        { id: "H2", domain: "IPV6",
          text: "For a static IPv6 default route on a Junos router pointing to a link-local next hop, what must also be specified?",
          options: [
            "Nothing extra is needed",
            "The outgoing interface, because a link-local next hop is ambiguous without the interface qualifier",
            "A route target",
            "An SRGB"
          ],
          answer: 1, multi: false,
          explanation: "Link-local addresses are only meaningful per interface, so a static IPv6 route using a link-local next hop must include the interface (e.g., next-hop fe80::1 with the interface specified) to disambiguate which link the next hop is on." },
        { id: "H3", domain: "TUNNELS",
          text: "Two IPv6 sites are separated by an IPv4-only core you control only at the edges, with no MPLS. Which is the most direct way to connect them?",
          options: [
            "Deploy an L3VPN",
            "Configure a GRE tunnel between the edge routers and route IPv6 across it (IPv6-over-IPv4)",
            "Use VRRP between the sites",
            "Enable Q-in-Q"
          ],
          answer: 1, multi: false,
          explanation: "A GRE tunnel between the edges encapsulates IPv6 within IPv4, joining the IPv6 islands over the IPv4-only core. It requires only edge configuration and no MPLS; L3VPN needs a provider MPLS core, and VRRP/Q-in-Q solve unrelated problems." },
        { id: "H4", domain: "TUNNELS",
          text: "After building an IPv6-over-IPv4 GRE tunnel, users report large downloads stalling while pings work. Which two mitigations are appropriate? (Choose two.)",
          options: [
            "Clamp the TCP MSS on the tunnel to account for the GRE/IPv4 overhead",
            "Lower the tunnel MTU and/or ensure PMTUD works (permit the needed ICMPv6 'packet too big')",
            "Remove the IGP",
            "Disable IPv6 entirely"
          ],
          answer: [0, 1], multi: true,
          explanation: "GRE plus outer IPv4 headers shrink the usable MTU, so large TCP flows black-hole while small packets pass. Clamping MSS on the tunnel and lowering the tunnel MTU / allowing PMTUD (ICMPv6 Packet Too Big) resolve it. The other options break connectivity." },
        { id: "H5", domain: "IPV6",
          text: "Which OSPF version routes IPv6, and what is one operational difference from OSPFv2 worth noting on an IPv6-only router?",
          options: [
            "OSPFv2; it needs no Router ID",
            "OSPFv3; it still requires a 32-bit Router ID, which may need to be set manually when there is no IPv4 address to derive it from",
            "OSPFv1; it uses MAC addresses",
            "RIPng; it is a link-state protocol"
          ],
          answer: 1, multi: false,
          explanation: "OSPFv3 carries IPv6 and runs per-link using link-local addresses, but it still needs a unique 32-bit Router ID; on an IPv6-only device you often must configure the Router ID explicitly since there is no IPv4 address to auto-derive it." },
        { id: "H6", domain: "BGP",
          text: "To exchange IPv6 prefixes with an EBGP peer, which BGP capability/family must be negotiated?",
          options: [
            "The IPv4 unicast family only",
            "The IPv6 unicast address family (multiprotocol BGP for inet6)",
            "The l2vpn family",
            "No family is needed; IPv4 sessions carry IPv6 automatically"
          ],
          answer: 1, multi: false,
          explanation: "Carrying IPv6 NLRI requires multiprotocol BGP with the IPv6 (inet6) unicast family negotiated between peers. The session can run over IPv4 or IPv6 transport, but the inet6 family must be enabled to advertise IPv6 routes." },
        { id: "H7", domain: "HA",
          text: "A provider switch/router must preserve Layer 2 forwarding and spanning-tree/MAC state across a Routing Engine switchover. Which feature provides this, and what does it build on?",
          options: [
            "NSR, building on VRRP",
            "Nonstop bridging (NSB), building on GRES",
            "RTG, building on LDP",
            "ISSU, building on DHCP snooping"
          ],
          answer: 1, multi: false,
          explanation: "Nonstop bridging (NSB) preserves Layer 2 protocol/MAC state across a switchover and, like NSR for routing, is built on top of GRES (which preserves kernel/forwarding state). VRRP/RTG/DHCP snooping are unrelated to this role." },
        { id: "H8", domain: "HA",
          text: "You configure BFD on an IS-IS adjacency with minimum-interval 100 ms and multiplier 3. What is the approximate detection time and its purpose?",
          options: [
            "~300 ms; provides sub-second detection of a forwarding-path failure so IS-IS reconverges faster than its native timers",
            "~3 seconds; slower than IS-IS",
            "~100 ms; but it disables IS-IS",
            "~30 ms; identical to hello timers"
          ],
          answer: 0, multi: false,
          explanation: "Detection time ≈ interval × multiplier = 100 ms × 3 = 300 ms. BFD gives lightweight sub-second liveness detection between neighbors, letting IS-IS tear down and reconverge immediately — valuable when a mid-span failure keeps the interface up." },
        { id: "H9", domain: "HA",
          text: "Which statement about a LAG (aggregated Ethernet) with LACP is correct?",
          options: [
            "Only one member forwards at a time",
            "Multiple member links are active simultaneously, and LACP detects member health and prevents mis-cabled members from joining",
            "It requires spanning tree to avoid loops on the bundle",
            "It cannot span line cards"
          ],
          answer: 1, multi: false,
          explanation: "A LAG uses all compatible members simultaneously (load sharing) and LACP verifies member health/agreement, keeping mis-configured or failed links out of the bundle. The bundle is a single logical link, so STP is not needed to loop-protect it." },
        { id: "H10", domain: "IPV6",
          text: "Which ICMPv6 Neighbor Discovery function replaces IPv4's ARP for mapping an IPv6 address to a link-layer address?",
          options: [
            "Router Advertisement",
            "Neighbor Solicitation / Neighbor Advertisement",
            "Redirect",
            "Echo Request"
          ],
          answer: 1, multi: false,
          explanation: "Neighbor Solicitation/Advertisement performs IPv6 address resolution (the ARP replacement). Router Advertisements handle router/prefix discovery, Redirect optimizes next hops, and Echo is ping." },
        { id: "H11", domain: "HA",
          text: "Graceful restart (GR) and GRES address different layers of resiliency. Which pairing is accurate?",
          options: [
            "GR is a protocol-level restart mechanism relying on helper neighbors; GRES preserves kernel/forwarding state during an RE switchover",
            "GR preserves kernel state; GRES relies on neighbors",
            "Both require two chassis",
            "Both are Layer 2 only"
          ],
          answer: 0, multi: false,
          explanation: "GR is a routing-protocol capability where helper neighbors keep forwarding while a router restarts its control plane; GRES is the chassis feature that syncs kernel/forwarding state to the backup RE for a fast switchover. NSR/NSB add protocol/L2 state preservation on top of GRES." },
        { id: "H12", domain: "TUNNELS",
          text: "Which Junos interface type carries a GRE tunnel, and is GRE encrypted by default?",
          options: [
            "ip-; yes, encrypted",
            "gr-; no, GRE provides encapsulation only, not encryption",
            "irb; yes",
            "ae-; no"
          ],
          answer: 1, multi: false,
          explanation: "GRE tunnels use gr- interfaces (tunnel services required) and provide encapsulation without encryption. If confidentiality is needed you must add encryption (e.g., IPsec) on top; ip- is for IP-IP tunnels." },
        { id: "H13", domain: "IPV6",
          text: "A dual-stack PE learns customer IPv6 routes via OSPFv3 and must advertise them to a remote PE over the existing BGP infrastructure. Which family enables this over the core?",
          options: [
            "inet unicast",
            "inet6 unicast (MP-BGP for IPv6), or 6PE if transporting over an IPv4/MPLS core",
            "l2vpn",
            "iso"
          ],
          answer: 1, multi: false,
          explanation: "Advertising IPv6 prefixes in BGP needs the inet6 unicast family; if the core is IPv4/MPLS, 6PE carries the IPv6 routes with labels over existing LSPs. OSPFv3 handles the IGP side; BGP inet6/6PE handles inter-PE transport." },
        { id: "H14", domain: "HA",
          text: "VRRP is configured with two routers; the intended master should relinquish mastership if its upstream link fails. Which VRRP capability implements that behavior?",
          options: [
            "Lowering the advertisement interval",
            "Interface/track-based priority reduction so the master's priority drops below the backup when the tracked upstream fails",
            "Disabling preempt",
            "Setting equal priorities"
          ],
          answer: 1, multi: false,
          explanation: "VRRP tracking monitors an upstream interface (or route) and reduces the master's effective priority on failure; once it falls below the backup, the backup takes over — giving upstream-aware gateway failover." },
        { id: "H15", domain: "HA",
          text: "Which combination provides both continuous forwarding during an RE switchover AND uninterrupted routing adjacencies without neighbor cooperation on a dual-RE SP router?",
          options: [
            "GRES together with NSR (and NSB for Layer 2)",
            "VRRP together with RTG",
            "LDP together with RSVP",
            "DHCP snooping together with DAI"
          ],
          answer: 0, multi: false,
          explanation: "GRES preserves forwarding, NSR preserves routing-protocol state (and NSB preserves Layer 2 state) across an RE switchover with no neighbor cooperation required — the standard SP HA stack. The other pairings address gateway/uplink redundancy, label distribution, or L2 security." }
      ]
    }
  ];

  if (typeof SP_CERT !== "undefined" && SP_CERT && Array.isArray(SP_CERT.exams)) {
    SP_CERT.exams = SP_CERT.exams.concat(GAP_SP_EXAMS);
  }
  if (typeof module !== "undefined") { module.exports = { GAP_SP_EXAMS: GAP_SP_EXAMS }; }
})();
