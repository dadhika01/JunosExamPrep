/*
 * JNCIS-SP (JN0-364) — additional mock exams (D, E, F).
 * Original, scenario-based, exam-style questions written to the published
 * JNCIS-SP objectives. No question repeats those in data-sp.js.
 * Answer keys are deliberately spread across A/B/C/D and answer lengths varied.
 *
 * This file appends its exams to SP_CERT.exams (defined in data-sp.js).
 */
(function () {
  var NEW_SP_EXAMS = [
    // ============================================================
    {
      id: "SP-D",
      name: "Mock Exam D — MPLS & VPN Scenarios",
      description: "Scenario and troubleshooting items across LSPs, LDP/RSVP, and MPLS VPN services.",
      questions: [
        { id: "D1", domain: "MPLS",
          text: "An LDP-signaled LSP between two PEs is down. LDP neighbors are up and the IGP has a route to the egress loopback, but 'show route table inet.3' has no entry for that loopback. Which cause is most consistent with the symptom?",
          options: [
            "The egress loopback is advertised only with a /24, not a /32, so LDP does not build a host LSP to it",
            "RSVP is disabled",
            "The core interfaces lack an IP address",
            "BGP is not configured"
          ],
          answer: 0, multi: false,
          explanation: "LDP by default builds LSPs to /32 (host) FECs for loopbacks. If the egress loopback is carried as a /24 (or the IGP mask is wrong), no /32 FEC exists, so no inet.3 entry is created and BGP next-hop resolution over the LSP fails. Advertising the loopback as /32 fixes it." },
        { id: "D2", domain: "VPN",
          text: "In an L3VPN, a customer site's routes appear in the local VRF but not in the remote PE's VRF. MP-BGP (inet-vpn) is established and routes are in bgp.l3vpn.0 on the remote PE. What is the most likely misconfiguration?",
          options: [
            "The RD is identical on both PEs",
            "The vrf-import policy / route targets on the remote VRF do not match the exported route targets",
            "LDP is not running",
            "The CE is using OSPF"
          ],
          answer: 1, multi: false,
          explanation: "Routes reaching bgp.l3vpn.0 but not the VRF is the classic route-target import mismatch: the routes are received but not imported into the VRF because the vrf-import RTs don't match what the originating PE exported. Fix the route-target import/export to align." },
        { id: "D3", domain: "MPLS",
          text: "You need an LSP that avoids a congested link and reserves 200 Mbps. Which signaling protocol and object combination is required?",
          options: [
            "LDP with a prefix-list",
            "RSVP-TE with an explicit-route object (ERO) and a bandwidth reservation",
            "OSPF with a summary",
            "BGP with a community"
          ],
          answer: 1, multi: false,
          explanation: "Bandwidth reservation and explicit path steering are RSVP-TE features: the ERO constrains the path (to avoid the congested link) and the reservation books 200 Mbps along it. LDP follows the IGP and cannot reserve bandwidth or steer explicitly." },
        { id: "D4", domain: "VPN",
          text: "A VPLS instance shows customer sites learning each other's MACs, but a newly added third site cannot reach the others. The pseudowires to the first two sites are up; the new site's pseudowire is down. Which area should you check first?",
          options: [
            "The classifier on the CE",
            "The signaling for the new site's pseudowire (e.g., site-id/VE-id, or LDP/BGP signaling and the LSP to that PE)",
            "The OSPF reference bandwidth",
            "The drop profile"
          ],
          answer: 1, multi: false,
          explanation: "VPLS forwards over a full mesh of pseudowires; if the new site's pseudowire is down, check its signaling (BGP VE-id/site-range for Kompella, or LDP VC and the transport LSP to that PE). Until that pseudowire comes up, the third site is isolated even though the others work." },
        { id: "D5", domain: "MPLS",
          text: "A traceroute across your MPLS core from a customer does not reveal the provider's core routers' hops. Which behavior explains this, and is it a problem?",
          options: [
            "The core is down; it is a problem",
            "MPLS TTL no-propagate hides core hops by not copying IP TTL into the label; it is often intentional for topology hiding",
            "BGP damping is active",
            "The classifier is dropping ICMP"
          ],
          answer: 1, multi: false,
          explanation: "With 'no-propagate-ttl', the IP TTL is not copied into the MPLS label, so transit LSRs do not decrement the customer-visible TTL and traceroute skips core hops. Providers frequently enable this to hide internal topology; it is by design, not a fault." },
        { id: "D6", domain: "VPN",
          text: "Design: a customer needs a simple point-to-point Ethernet handoff between two of their sites across your MPLS core, with no MAC learning or multipoint behavior. Which service is the best fit?",
          options: [
            "L3VPN",
            "An L2 circuit (point-to-point pseudowire)",
            "VPLS",
            "6PE"
          ],
          answer: 1, multi: false,
          explanation: "A point-to-point Ethernet pseudowire (L2 circuit) transports a single customer L2 connection between two PE interfaces without MAC learning or multipoint flooding. VPLS is multipoint (LAN emulation); L3VPN is a routed service; 6PE is an IPv6-over-MPLS transition method." },
        { id: "D7", domain: "BGP",
          text: "Between two providers you must exchange VPNv4 routes at the AS boundary while keeping a single labeled hop between the ASBRs and no per-VRF sub-interfaces. Which inter-AS L3VPN option is this?",
          options: [
            "Option A",
            "Option B",
            "Option C",
            "Option D"
          ],
          answer: 1, multi: false,
          explanation: "Inter-AS Option B has the ASBRs exchange labeled VPNv4 routes directly over MP-EBGP (single labeled hop, no per-VRF interfaces). Option A uses back-to-back per-VRF sub-interfaces; Option C pushes PE loopbacks between ASes with multihop MP-EBGP between route reflectors." },
        { id: "D8", domain: "MPLS",
          text: "Both an RSVP LSP and an LDP LSP exist to the same egress PE loopback. You want traffic to use the RSVP LSP but it is using LDP. Assuming defaults were changed, which explanation fits?",
          options: [
            "LDP always wins over RSVP",
            "The route preferences were altered so LDP's preference is now lower (better) than RSVP's in inet.3",
            "RSVP cannot install into inet.3",
            "The egress PE rejected RSVP"
          ],
          answer: 1, multi: false,
          explanation: "By default RSVP (preference 7) is preferred over LDP (preference 9) in inet.3. If LDP is being used instead, someone changed the preferences so LDP's is now numerically lower (better). Restoring defaults or explicitly preferring RSVP corrects it." },
        { id: "D9", domain: "VPN",
          text: "A dual-homed customer site (connected to two PEs) develops a routing loop where routes learned from the site via one PE are re-advertised back to it via the other PE. Which BGP extended community prevents this?",
          options: [
            "Route target",
            "Site-of-Origin (SoO)",
            "no-export",
            "Aggregator"
          ],
          answer: 1, multi: false,
          explanation: "Site-of-Origin (SoO) tags routes with the originating site so a PE will not re-advertise a route back to the same site that sourced it, preventing loops in multihomed L3VPN sites. Route targets control VRF import/export, not per-site loop prevention." },
        { id: "D10", domain: "MPLS",
          text: "An ingress PE has the egress loopback in inet.3 via an LSP, but customer VPN traffic still isn't label-switched and is dropped. The VRF has routes with the correct protocol-next-hop (the egress PE loopback). Which check is most relevant?",
          options: [
            "Whether 'family mpls' is enabled on the core-facing interface(s) so labeled packets can be sent/received",
            "Whether the CE runs RSVP",
            "Whether storm control is enabled",
            "Whether the loopback is a /24"
          ],
          answer: 0, multi: false,
          explanation: "Even with inet.3 resolution, the physical core interfaces must have 'family mpls' enabled to transmit/receive labeled packets. Missing family mpls on a core interface means labels can't be pushed onto the wire and VPN traffic is dropped." },
        { id: "D11", domain: "VPN",
          text: "You want spoke sites in an L3VPN to communicate only through a central hub (for inspection), never directly spoke-to-spoke. Which route-target design accomplishes this?",
          options: [
            "All sites import and export the same single RT",
            "Spokes export a spoke-RT and import a hub-RT; the hub imports the spoke-RT and exports a hub-RT (asymmetric RTs)",
            "Use identical RDs on all spokes",
            "Disable MP-BGP between PEs"
          ],
          answer: 1, multi: false,
          explanation: "Asymmetric route targets create hub-and-spoke: spokes send their routes (spoke-RT) only to the hub and receive only hub-originated routes (hub-RT), so spoke-to-spoke traffic must transit the hub. A single shared RT would create a full mesh." },
        { id: "D12", domain: "MPLS",
          text: "During a link failure you observe traffic on a protected RSVP LSP is repaired in ~50 ms before the head-end resignals a new path. Which feature provides this local repair?",
          options: [
            "Graceful restart",
            "RSVP fast reroute (link/node protection via bypass or detour LSPs)",
            "BGP multipath",
            "LDP session protection"
          ],
          answer: 1, multi: false,
          explanation: "RSVP fast reroute pre-establishes bypass (facility) or detour LSPs so the point of local repair reroutes traffic within tens of milliseconds upon a link/node failure, well before the head-end computes and signals a new primary path." },
        { id: "D13", domain: "COS",
          text: "Across the MPLS core you must preserve customer CoS even though transit LSRs don't inspect inner IP headers. How is CoS conveyed on labeled packets, and what happens at the egress PE?",
          options: [
            "802.1p in Ethernet; egress ignores it",
            "The label's EXP/Traffic-Class bits carry CoS across the core; the egress PE maps EXP back to DSCP (or preserves it) via classifiers/rewrite",
            "The RD carries CoS",
            "CoS cannot cross MPLS"
          ],
          answer: 1, multi: false,
          explanation: "CoS rides in the 3-bit EXP (Traffic Class) field of the MPLS label so transit LSRs can honor it without reading inner IP. At the egress PE, EXP-to-DSCP classification/rewrite restores or preserves the customer's IP marking end to end." },
        { id: "D14", domain: "VPN",
          text: "A PE-CE eBGP session in a VRF is up, but the customer complains their routes aren't reaching remote sites. On the local PE the routes are in the VRF but absent from bgp.l3vpn.0. Which step is missing?",
          options: [
            "A vrf-export policy (and route targets) to advertise the VRF routes into MP-BGP as VPNv4",
            "Enabling RSVP",
            "Configuring VRRP",
            "A drop profile"
          ],
          answer: 0, multi: false,
          explanation: "VRF routes must be exported into MP-BGP as VPNv4 via a vrf-export policy that attaches the appropriate route targets. Without it, the routes stay local to the VRF and never populate bgp.l3vpn.0 for advertisement to remote PEs." },
        { id: "D15", domain: "MPLS",
          text: "Which statement correctly distinguishes the roles of inet.3 and mpls.0 on a Junos PE/LSR?",
          options: [
            "inet.3 holds transit label-swap entries; mpls.0 holds IPv4 unicast",
            "inet.3 holds LSP egress next hops used for BGP next-hop resolution at ingress; mpls.0 holds the transit label-switching (swap/pop) entries",
            "Both hold identical data",
            "inet.3 is for IPv6 only"
          ],
          answer: 1, multi: false,
          explanation: "inet.3 stores tunnel/LSP egress next hops that BGP uses to resolve next hops at the ingress PE; mpls.0 contains the label operations (incoming label → swap/pop + next hop) used by transit LSRs. They serve ingress-resolution vs transit-switching roles respectively." },
        { id: "D16", domain: "IPV6",
          text: "You must carry IPv6 customer prefixes across an existing IPv4/MPLS core without deploying native IPv6 in the core. Which approach uses MP-BGP with labeled IPv6 on the PEs?",
          options: [
            "NAT64",
            "6PE",
            "Dual stack on every core router",
            "IP-IP tunnels between CEs"
          ],
          answer: 1, multi: false,
          explanation: "6PE advertises IPv6 routes with MPLS labels via MP-BGP over an IPv4/MPLS core, letting existing LSPs transport IPv6 without upgrading core routers to native IPv6. NAT64 is address translation; dual-stack-everywhere is the very upgrade 6PE avoids." },
        { id: "D17", domain: "BGP",
          text: "PEs exchange VPNv4 routes but you refuse to build a full IBGP mesh among 30 PEs. Which scaling mechanism is standard, and what must it be able to carry?",
          options: [
            "EBGP confederations carrying only IPv4",
            "Route reflectors that support the inet-vpn (VPNv4) family for reflected VPN routes",
            "Static routes only",
            "LDP targeted sessions"
          ],
          answer: 1, multi: false,
          explanation: "Route reflectors relax the IBGP full-mesh requirement; for L3VPN they must reflect the inet-vpn (VPNv4) address family so VPN routes propagate among all PEs. Confederations are an alternative but the question targets reflectors and the VPNv4 family requirement." },
        { id: "D18", domain: "TUNNELS",
          text: "Customers report that large packets across a GRE tunnel fail while small packets succeed, and DF-bit traffic is dropped. Which two remedies are appropriate? (Choose two.)",
          options: [
            "Adjust the TCP MSS (clamp) on the tunnel",
            "Ensure Path MTU Discovery works (don't filter the required ICMP messages) / lower the tunnel MTU",
            "Disable the IGP",
            "Remove all route targets"
          ],
          answer: [0, 1], multi: true,
          explanation: "GRE encapsulation lowers the effective MTU, so large/DF packets are dropped. Clamping TCP MSS on the tunnel and ensuring PMTUD works (permitting the ICMP 'fragmentation needed'/'packet too big' messages) — or simply lowering the tunnel MTU — resolves the black-holing. The other options are unrelated." },
        { id: "D19", domain: "VPN",
          text: "Which routing-instance type would you configure on a PE to provide a BGP/MPLS IP VPN (RFC 4364) for a customer?",
          options: [
            "virtual-router",
            "vrf",
            "vpls",
            "l2vpn"
          ],
          answer: 1, multi: false,
          explanation: "The 'vrf' instance-type provides a per-customer routing table with a route-distinguisher and vrf-import/vrf-export (route targets) for RFC 4364 L3VPN. 'virtual-router' lacks RD/RT VPN semantics; 'vpls' and 'l2vpn' are Layer 2 services." },
        { id: "D20", domain: "MPLS",
          text: "An egress PE advertises label 3 for a FEC to its upstream neighbor. What behavior does this request?",
          options: [
            "Explicit null — keep the label for CoS",
            "Implicit null — the penultimate router should pop the label (PHP)",
            "Router alert handling",
            "Drop the FEC"
          ],
          answer: 1, multi: false,
          explanation: "Label 3 is the implicit-null label; advertising it tells the penultimate LSR to pop the transport label (PHP) so the egress does a single lookup. Label 0 (explicit null) instead asks the upstream to keep a null label so the egress can still read EXP/CoS." }
      ]
    },
    // ============================================================
    {
      id: "SP-E",
      name: "Mock Exam E — Routing, IPv6 & Design",
      description: "IGP/BGP behavior, IPv6, tunnels, CoS and HA — configuration and design focus.",
      questions: [
        { id: "E1", domain: "OSPF",
          text: "Two routers running OSPFv3 for IPv6 will not form an adjacency, though IPv6 link-local connectivity works and both are in area 0. 'show ospf3 interface' shows the interface up. Which OSPFv3-specific requirement is worth verifying?",
          options: [
            "That both have a valid, unique 32-bit Router ID configured (OSPFv3 still needs one, and may not auto-derive it without an IPv4 address)",
            "That both use the same IPv6 global prefix on the link",
            "That MED is set",
            "That the reference bandwidth matches"
          ],
          answer: 0, multi: false,
          explanation: "OSPFv3 still requires a 32-bit Router ID. On an IPv6-only device with no IPv4 address, the Router ID may not auto-derive and must be set explicitly; without a valid unique Router ID the adjacency won't form even though link-local connectivity exists. OSPFv3 runs per-link and does not require matching global prefixes." },
        { id: "E2", domain: "ISIS",
          text: "You want a single IS-IS instance to carry both IPv4 and IPv6 while allowing different topologies/metrics per address family (e.g., some links IPv4-only). Which capability enables this?",
          options: [
            "Single-topology IS-IS",
            "Multi-topology IS-IS (separate IPv4 and IPv6 topologies)",
            "OSPFv3",
            "Wide metrics alone"
          ],
          answer: 1, multi: false,
          explanation: "Multi-topology IS-IS maintains separate topologies for IPv4 and IPv6, so links can differ per address family and metrics can be tuned independently. Single-topology IS-IS assumes IPv4 and IPv6 share the same topology, which breaks if some links are one-family-only." },
        { id: "E3", domain: "BGP",
          text: "An IBGP-learned prefix is hidden (inactive) on a PE with the reason 'unusable next hop'. The next hop is the remote PE loopback. Which fix directly addresses the cause?",
          options: [
            "Configure 'next-hop self' on the advertising router or ensure the next hop is resolvable (via IGP/LSP in inet.0/inet.3)",
            "Enable damping",
            "Add a route target",
            "Increase local preference"
          ],
          answer: 0, multi: false,
          explanation: "A BGP route is unusable if its next hop is unresolvable. Either make the advertising router set 'next-hop self' (so the next hop is a directly reachable address) or ensure the remote loopback is resolvable via the IGP/LSP (inet.0 or inet.3). Damping/RT/local-pref don't resolve next-hop reachability." },
        { id: "E4", domain: "IPV6",
          text: "A host must build a global IPv6 address automatically from the router's advertised prefix, without a DHCPv6 server. Which two elements make this possible? (Choose two.)",
          options: [
            "Router Advertisements carrying the on-link prefix with the autonomous flag set",
            "An interface identifier generated by the host (EUI-64 or randomized)",
            "A DHCPv4 relay",
            "A static ARP entry"
          ],
          answer: [0, 1], multi: true,
          explanation: "SLAAC combines the prefix from a Router Advertisement (with the A/autonomous flag) and a host-generated interface identifier (EUI-64 or privacy/random) to form a global address — no DHCP server needed. DHCPv4 relay and ARP are IPv4 constructs irrelevant to IPv6 SLAAC." },
        { id: "E5", domain: "TUNNELS",
          text: "You configure an IP-IP tunnel between two routers. Which interface family/type and consideration are correct?",
          options: [
            "gr- interface; consideration: it encrypts by default",
            "ip- interface; consideration: encapsulation overhead lowers effective MTU (plan MSS/MTU); no encryption",
            "irb interface; consideration: it bridges VLANs",
            "ae interface; consideration: it needs LACP"
          ],
          answer: 1, multi: false,
          explanation: "IP-IP tunnels use ip- interfaces (GRE uses gr-). Neither IP-IP nor GRE encrypts; both add header overhead that reduces the payload MTU, so you must plan MTU/MSS to avoid fragmentation or black-holing of large packets." },
        { id: "E6", domain: "HA",
          text: "During a planned RE switchover on a provider edge router, you require that IS-IS and BGP neighbors never detect a restart and forwarding is uninterrupted, without depending on neighbor cooperation. Which features do you enable?",
          options: [
            "Graceful restart only (relies on helper neighbors)",
            "GRES plus NSR (self-contained protocol-state replication to the backup RE)",
            "VRRP with tracking",
            "LDP session protection"
          ],
          answer: 1, multi: false,
          explanation: "GRES preserves forwarding state and NSR replicates routing-protocol state to the backup RE, so neighbors never see a restart — and unlike graceful restart, NSR does not depend on helper neighbors. VRRP and LDP session protection solve different problems." },
        { id: "E7", domain: "BGP",
          text: "A route to a customer prefix flaps repeatedly, churning the core. You enable route flap damping. What is the main risk to weigh?",
          options: [
            "It encrypts BGP updates",
            "Over-penalizing legitimately changing routes, delaying reconvergence for real changes",
            "It disables MED",
            "It requires MPLS"
          ],
          answer: 1, multi: false,
          explanation: "Damping accumulates a penalty on flapping routes and suppresses them, reducing churn — but if thresholds are too aggressive it can suppress routes that had a single legitimate change, delaying convergence. Tune the parameters (or scope damping) carefully." },
        { id: "E8", domain: "IPV6",
          text: "In IPv6, which ICMPv6 message pair performs the address-resolution function that ARP provides in IPv4?",
          options: [
            "Router Solicitation / Router Advertisement",
            "Neighbor Solicitation / Neighbor Advertisement",
            "Echo Request / Echo Reply",
            "Redirect / Too Big"
          ],
          answer: 1, multi: false,
          explanation: "Neighbor Solicitation/Advertisement (part of Neighbor Discovery) resolves an IPv6 address to a link-layer address, replacing ARP. Router Solicitation/Advertisement handle router/prefix discovery; Echo is ping; Redirect/Too Big serve other functions." },
        { id: "E9", domain: "MPLS",
          text: "Design: you need LSPs that automatically follow IGP shortest paths with minimal configuration and no bandwidth guarantees, across the whole core. Which label-distribution choice fits, and why?",
          options: [
            "RSVP-TE, because it is simplest",
            "LDP, because it distributes labels for IGP FECs and follows the IGP with little configuration",
            "BGP-LU only",
            "Static LSPs"
          ],
          answer: 1, multi: false,
          explanation: "LDP is the low-touch choice: it advertises labels for IGP-learned FECs and its LSPs follow the IGP shortest path automatically, with no per-LSP configuration. RSVP-TE adds TE/bandwidth features at the cost of more configuration and state." },
        { id: "E10", domain: "OSPF",
          text: "On a broadcast segment with several OSPF routers you want a specific router to always be DR and another to be BDR, deterministically. Which configuration achieves this?",
          options: [
            "Set the desired DR's interface priority highest and the BDR's next-highest; set others to priority 0",
            "Lower the reference bandwidth on the DR",
            "Use NSSA",
            "Configure a virtual link"
          ],
          answer: 0, multi: false,
          explanation: "DR/BDR election favors the highest interface priority. Give the intended DR the highest priority, the BDR the next-highest, and set the remaining routers to priority 0 (ineligible). Note existing DRs aren't preempted, so plan the rollout accordingly." },
        { id: "E11", domain: "VPN",
          text: "You must connect two customer sites at Layer 2 across the core using BGP for both auto-discovery and signaling (rather than manually configuring remote PE/VC-IDs). Which service model is this?",
          options: [
            "LDP-signaled L2 circuit (Martini)",
            "BGP-signaled L2VPN (Kompella)",
            "L3VPN",
            "6PE"
          ],
          answer: 1, multi: false,
          explanation: "Kompella L2VPN uses BGP for auto-discovery and signaling, avoiding manual remote-PE/VC-ID configuration. Martini L2 circuits use targeted LDP and require manual neighbor/VC-ID setup. L3VPN and 6PE are routed/IPv6-transition services." },
        { id: "E12", domain: "COS",
          text: "On a provider egress interface toward a customer you must cap total output to a subrate (e.g., 200 Mbps on a GE port) and smooth bursts. Which CoS component do you apply?",
          options: [
            "A behavior-aggregate classifier",
            "A shaping-rate (shaper) on the interface/scheduler",
            "A rewrite rule",
            "A route target"
          ],
          answer: 1, multi: false,
          explanation: "A shaping-rate caps and smooths the transmit rate (e.g., 200 Mbps subrate on a 1G port), buffering bursts up to the shaped rate. Classifiers assign classes on ingress; rewrite rules re-mark; route targets are a VPN construct." },
        { id: "E13", domain: "ISIS",
          text: "A core IS-IS router should keep advertising its directly connected loopback/services during a maintenance convergence window but must not be used to transit other traffic. Which single mechanism does this cleanly?",
          options: [
            "Set the overload bit",
            "Withdraw the loopback",
            "Shut all interfaces",
            "Switch to OSPF"
          ],
          answer: 0, multi: false,
          explanation: "The IS-IS overload bit signals other routers to avoid using this node for transit (its transit paths become unusable) while its own connected prefixes remain reachable — ideal for maintenance or waiting on BGP to converge before carrying transit traffic." },
        { id: "E14", domain: "TUNNELS",
          text: "Two IPv6 islands must be joined across an IPv4-only network where you control only the edge routers and have no MPLS. Which is the most direct tunneling solution?",
          options: [
            "Deploy L3VPN",
            "Build a GRE (or IP-IP) tunnel between the edge routers carrying IPv6 over IPv4",
            "Enable 6PE",
            "Use VRRP"
          ],
          answer: 1, multi: false,
          explanation: "Without MPLS, a GRE (or IP-IP) tunnel between the edges encapsulates IPv6 over the IPv4 core, joining the islands. 6PE requires an MPLS core; L3VPN is a provider service; VRRP is gateway redundancy." },
        { id: "E15", domain: "BGP",
          text: "You must ensure your AS is NOT used as a transit path between two of your EBGP neighbors (they should not reach each other through you). Which policy approach is standard?",
          options: [
            "Advertise a default route to both",
            "Apply export policy so routes learned from one EBGP peer are not advertised to the other (and/or use communities to scope advertisements)",
            "Set local preference to 0",
            "Enable route reflection"
          ],
          answer: 1, multi: false,
          explanation: "Preventing transit is a policy decision: your export policies must not re-advertise routes learned from one external peer to another (often enforced with communities or explicit filters). Default routes and route reflection don't prevent transit; local-pref affects your own selection, not what you advertise." },
        { id: "E16", domain: "IPV6",
          text: "Which IPv6 address category would you use for internal, non-globally-routed addressing analogous to RFC 1918, and what is its prefix?",
          options: [
            "Link-local, FE80::/10",
            "Unique local addresses (ULA), FC00::/7 (commonly FD00::/8)",
            "Global unicast, 2000::/3",
            "Multicast, FF00::/8"
          ],
          answer: 1, multi: false,
          explanation: "Unique local addresses (FC00::/7, in practice FD00::/8 for locally assigned) provide private, non-globally-routed IPv6 addressing similar to RFC 1918. Link-local is single-link only; 2000::/3 is global; FF00::/8 is multicast." },
        { id: "E17", domain: "HA",
          text: "You configure BFD on an IS-IS adjacency with minimum-interval 250 ms and multiplier 4. What is the approximate detection time, and what is the benefit over IS-IS hellos?",
          options: [
            "~1 second; far faster failure detection than default IS-IS hello/hold timers",
            "~250 ms; slower than IS-IS",
            "~4 seconds; identical to IS-IS",
            "~40 ms; but IS-IS is faster"
          ],
          answer: 0, multi: false,
          explanation: "Detection ≈ interval × multiplier = 250 ms × 4 = 1 second, which is much faster than default IS-IS hello/hold timers, letting IS-IS reconverge quickly when a mid-span failure doesn't drop the interface." },
        { id: "E18", domain: "MPLS",
          text: "You need a scalable way to steer specific traffic onto a particular LSP for a subset of destinations without changing the IGP. Which Junos mechanism maps traffic/prefixes onto a named LSP?",
          options: [
            "A forwarding-table export load-balancing policy only",
            "install/prefixes with the LSP as next hop, or a policy that resolves selected routes over the named LSP (e.g., via inet.3 and next-hop policy)",
            "A drop profile",
            "MVRP"
          ],
          answer: 1, multi: false,
          explanation: "You can direct selected prefixes onto a specific LSP by installing them with the LSP as the next hop or using policy so those routes resolve over the named LSP (leveraging inet.3). This steers traffic without altering IGP metrics for everyone." },
        { id: "E19", domain: "L2",
          text: "On an MX handling multiple L2 services on one physical port, you must allow multiple tagged logical units with independent VLAN tags and encapsulations. Which configuration enables this?",
          options: [
            "family inet only on unit 0",
            "flexible-vlan-tagging with flexible-ethernet-services encapsulation, defining multiple units",
            "A single access-mode unit",
            "family iso"
          ],
          answer: 1, multi: false,
          explanation: "flexible-vlan-tagging plus flexible-ethernet-services encapsulation lets one MX port host many logical units with different VLAN tags/encapsulations for different L2/L3 services (bridge domains, L2 circuits, etc.). A single access unit or inet-only cannot." },
        { id: "E20", domain: "OSPF",
          text: "An OSPF ABR should advertise a single 10.20.0.0/16 summary into the backbone instead of many /24s from its attached area. Which configuration produces the summary?",
          options: [
            "area <area> area-range 10.20.0.0/16 on the ABR",
            "A totally stubby backbone",
            "An lo0 firewall filter",
            "Raising the dead interval"
          ],
          answer: 0, multi: false,
          explanation: "area-range on the ABR aggregates that area's intra-area prefixes (the /24s) into one Type 3 summary (10.20.0.0/16) advertised to other areas, reducing LSA count and hiding churn. It is the OSPF inter-area summarization tool." }
      ]
    },
    // ============================================================
    {
      id: "SP-F",
      name: "Mock Exam F — Mixed Rapid 15",
      description: "A shorter 15-question mixed-difficulty set across the whole SP blueprint.",
      questions: [
        { id: "F1", domain: "MPLS",
          text: "In the MPLS shim header, what is the size of the label field itself?",
          options: ["3 bits", "8 bits", "20 bits", "32 bits"],
          answer: 2, multi: false,
          explanation: "The MPLS label value is 20 bits. The 32-bit shim header also includes 3 EXP/TC bits, a 1-bit bottom-of-stack (S) flag, and an 8-bit TTL." },
        { id: "F2", domain: "VPN",
          text: "What is the primary function of a route distinguisher in an L3VPN?",
          options: [
            "To decide which VRFs import a route",
            "To make otherwise-identical customer IPv4 prefixes unique as VPNv4 routes in MP-BGP",
            "To reserve bandwidth",
            "To encrypt VPN traffic"
          ],
          answer: 1, multi: false,
          explanation: "The RD is prepended to the IPv4 prefix to create a unique VPNv4 route so overlapping customer address space stays distinct in MP-BGP. Import/export membership is the job of route targets, not the RD." },
        { id: "F3", domain: "MPLS",
          text: "Which protocol reserves resources and supports explicit paths for traffic-engineered LSPs?",
          options: ["LDP", "RSVP-TE", "OSPF", "ARP"],
          answer: 1, multi: false,
          explanation: "RSVP-TE signals TE LSPs with bandwidth reservation and explicit routing (ERO). LDP has neither reservation nor explicit path steering." },
        { id: "F4", domain: "IPV6",
          text: "Which prefix identifies IPv6 link-local addresses?",
          options: ["2000::/3", "FC00::/7", "FE80::/10", "FF00::/8"],
          answer: 2, multi: false,
          explanation: "Link-local addresses use FE80::/10 and are valid only on a single link (used for ND, next-hop resolution). 2000::/3 is global unicast, FC00::/7 is ULA, FF00::/8 is multicast." },
        { id: "F5", domain: "BGP",
          text: "In Junos BGP path selection, which attribute is compared FIRST (after next-hop reachability)?",
          options: ["AS-path length", "Local preference (highest wins)", "MED", "Origin"],
          answer: 1, multi: false,
          explanation: "Highest local preference is the first major decision criterion, ahead of AS-path length, origin, and MED." },
        { id: "F6", domain: "OSPF",
          text: "Which OSPF version supports IPv6 and operates on a per-link basis?",
          options: ["OSPFv1", "OSPFv2", "OSPFv3", "RIPng"],
          answer: 2, multi: false,
          explanation: "OSPFv3 supports IPv6 (and can carry IPv4 via address families) and runs per-link, using IPv6 link-local addresses for protocol exchanges. OSPFv2 is IPv4; RIPng is a distance-vector protocol, not OSPF." },
        { id: "F7", domain: "ISIS",
          text: "Which IS-IS level interconnects areas, functioning like the OSPF backbone?",
          options: ["Level 1", "Level 2", "Level 3", "Level 0"],
          answer: 1, multi: false,
          explanation: "Level 2 is the inter-area backbone; Level 1 is intra-area. L1/L2 routers connect the two, similar to OSPF ABRs bridging areas to area 0." },
        { id: "F8", domain: "MPLS",
          text: "What does the S bit set to 1 in an MPLS label indicate?",
          options: [
            "The label is the top of stack",
            "The label is the bottom of the stack (next header is the payload)",
            "The packet should be dropped",
            "PHP is disabled"
          ],
          answer: 1, multi: false,
          explanation: "The S (bottom-of-stack) bit set to 1 marks the last label in the stack, telling the LSR the following header is the payload (e.g., IP) rather than another label." },
        { id: "F9", domain: "VPN",
          text: "Which MPLS VPN service provides multipoint Ethernet LAN emulation with MAC learning across the core?",
          options: ["L2 circuit", "VPLS", "L3VPN", "6PE"],
          answer: 1, multi: false,
          explanation: "VPLS emulates a multipoint Ethernet LAN with MAC learning and flooding across a pseudowire mesh. An L2 circuit is point-to-point; L3VPN is routed; 6PE is an IPv6 transition method." },
        { id: "F10", domain: "TUNNELS",
          text: "Which Junos interface type is used for a GRE tunnel?",
          options: ["ip-", "gr-", "ae-", "irb"],
          answer: 1, multi: false,
          explanation: "GRE tunnels use gr- interfaces; IP-IP tunnels use ip-. Both require tunnel services and neither is encrypted." },
        { id: "F11", domain: "HA",
          text: "Which feature must be enabled before Nonstop Active Routing (NSR) can function?",
          options: ["VRRP", "GRES", "MSTP", "LDP"],
          answer: 1, multi: false,
          explanation: "NSR is built on GRES: GRES synchronizes kernel/forwarding state, and NSR adds routing-protocol state replication so adjacencies survive an RE switchover." },
        { id: "F12", domain: "COS",
          text: "On labeled packets crossing the core, which field carries class-of-service information?",
          options: ["The RD", "The label's EXP (Traffic Class) bits", "The IP TTL", "The S bit"],
          answer: 1, multi: false,
          explanation: "The 3-bit EXP/Traffic-Class field in the MPLS label conveys CoS so transit LSRs honor priority without inspecting the inner IP DSCP." },
        { id: "F13", domain: "PIR",
          text: "Which routing table does a Junos ingress PE use to resolve a BGP next hop over an LSP?",
          options: ["inet.0", "inet.3", "mpls.0", "inet6.0"],
          answer: 1, multi: false,
          explanation: "inet.3 holds LSP/tunnel egress next hops used for BGP next-hop resolution at ingress. mpls.0 holds transit label operations; inet.0 is plain IPv4 unicast." },
        { id: "F14", domain: "BGP",
          text: "Which BGP extended community controls L3VPN route import/export among VRFs?",
          options: ["Route target", "Route distinguisher", "AS-path", "Origin"],
          answer: 0, multi: false,
          explanation: "The route-target extended community determines which VRFs import/export a VPN route, defining the VPN topology. The RD only provides prefix uniqueness and is not a community." },
        { id: "F15", domain: "MPLS",
          text: "Which label-distribution protocol builds LSPs that follow the IGP shortest path with minimal configuration?",
          options: ["RSVP-TE", "LDP", "BGP", "PIM"],
          answer: 1, multi: false,
          explanation: "LDP distributes labels for IGP FECs and its LSPs follow the IGP shortest path with little configuration. RSVP-TE adds TE/bandwidth features but needs more configuration and state." }
      ]
    }
  ];

  if (typeof SP_CERT !== "undefined" && SP_CERT && Array.isArray(SP_CERT.exams)) {
    SP_CERT.exams = SP_CERT.exams.concat(NEW_SP_EXAMS);
  }
  if (typeof module !== "undefined") { module.exports = { NEW_SP_EXAMS: NEW_SP_EXAMS }; }
})();
