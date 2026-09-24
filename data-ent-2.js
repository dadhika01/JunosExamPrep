/*
 * JNCIS-ENT (JN0-352) — additional mock exams (D, E, F).
 * Original, scenario-based, exam-style questions written to the published
 * JNCIS-ENT objectives. No question repeats those in data-ent.js.
 * Answer keys are deliberately spread across A/B/C/D and answer lengths varied.
 *
 * This file appends its exams to ENT_CERT.exams (defined in data-ent.js).
 */
(function () {
  var NEW_ENT_EXAMS = [
    // ============================================================
    {
      id: "ENT-D",
      name: "Mock Exam D — Scenarios & Troubleshooting",
      description: "Scenario-driven items: read the symptom or exhibit and pick the best action or cause.",
      questions: [
        { id: "D1", domain: "OSPF",
          text: "A newly configured OSPF neighbor on a point-to-point link never leaves the Init state, though you can ping the neighbor's interface. 'show ospf interface' shows the interface is up in area 0 on both ends. What should you investigate first?",
          options: [
            "Whether a firewall filter or authentication mismatch is blocking or dropping the neighbor's Hello packets",
            "Whether the reference bandwidth differs between the routers",
            "Whether the routers have the same OSPF process ID",
            "Whether NSSA is configured on one side"
          ],
          answer: 0, multi: false,
          explanation: "Stuck in Init means Hellos are being sent but the router does not see itself listed in the neighbor's Hello (or the neighbor's Hellos are not being accepted). A one-way Hello problem is classically caused by an inbound firewall filter dropping OSPF, or an authentication mismatch causing the neighbor to silently discard your Hellos. Reference bandwidth affects cost, not adjacency; Junos has no 'process ID' concept like IOS." },
        { id: "D2", domain: "STP",
          text: "After connecting a small unmanaged switch to an access port, users on that port lose connectivity and the interface log shows it was placed in a blocking/error state. The access port has edge and BPDU-protect configured. What most likely happened?",
          options: [
            "MVRP pruned the VLAN from the port",
            "The unmanaged switch sent BPDUs, so BPDU protect disabled the edge port",
            "Storm control shut the port for exceeding the multicast threshold",
            "The port negotiated a LAG and failed LACP"
          ],
          answer: 1, multi: false,
          explanation: "BPDU protect (bpdu-block) error-disables an edge port the instant it receives a BPDU. An unmanaged switch that still emits BPDUs trips this protection — exactly its purpose. You clear it (or use 'disable-timeout' to auto-recover) after removing the offending device." },
        { id: "D3", domain: "BGP",
          text: "You expect an EBGP-learned prefix to appear in a neighbor's table but it never arrives. On the advertising router 'show route' shows the prefix as active and learned via OSPF. The BGP export policy only has 'from protocol bgp; then accept'. Why is the route not advertised?",
          options: [
            "BGP never advertises OSPF routes under any circumstances",
            "The export policy only matches BGP-learned routes, so the OSPF-learned prefix is not exported",
            "EBGP requires the multihop statement to advertise IGP routes",
            "The route must first be tagged with a community"
          ],
          answer: 1, multi: false,
          explanation: "The active path is via OSPF, but the export policy matches 'from protocol bgp' only, so the OSPF route falls through to the default (reject for that neighbor). To advertise it you need a term matching the OSPF route (e.g., 'from protocol ospf' / route-filter) or a static/aggregate that BGP can export." },
        { id: "D4", domain: "L2",
          text: "Two access ports are meant to be in VLAN 20, but a host on one of them can only reach hosts on its own switch, not hosts in VLAN 20 on the neighboring switch across the trunk. The trunk carries VLANs 10 and 30. What is the fix?",
          options: [
            "Change the hosts to DHCP",
            "Add VLAN 20 to the trunk's member list on both switches",
            "Enable an IRB for VLAN 20",
            "Set the access ports to trunk mode"
          ],
          answer: 1, multi: false,
          explanation: "Intra-VLAN traffic between switches must traverse the trunk tagged with that VLAN. The trunk carries 10 and 30 but not 20, so VLAN 20 frames are never forwarded between switches. Adding VLAN 20 to the trunk 'vlan members' list on both ends restores connectivity. An IRB would be needed only for inter-VLAN routing, not same-VLAN reachability." },
        { id: "D5", domain: "PIR",
          text: "You configured a static route with 'qualified-next-hop' to a backup gateway with a higher preference than the primary next hop. Traffic uses the primary path, but when the primary next hop's interface goes down, traffic is black-holed instead of failing over. What is the most likely cause?",
          options: [
            "Qualified-next-hop cannot be used with static routes",
            "The primary next hop is still considered reachable (e.g., recursive/indirect) so the route is not withdrawn; consider BFD or an interface-based next hop",
            "The backup preference must be lower than the primary",
            "Static routes never fail over"
          ],
          answer: 1, multi: false,
          explanation: "If the primary next hop resolves indirectly (recursively) and that resolution stays valid, Junos keeps using it even though the physical path is dead, black-holing traffic. Tying failover to actual liveness — BFD for the static route, or a directly connected next hop that goes away with the interface — makes the qualified-next-hop backup take over." },
        { id: "D6", domain: "POLICY",
          text: "A lo0 firewall filter intended to protect the RE is applied, and now the router's own OSPF adjacencies drop. The filter permits SSH and ICMP and ends with an explicit 'then discard'. What was overlooked?",
          options: [
            "OSPF must be disabled before applying an lo0 filter",
            "The filter needs terms permitting the router's control-plane protocols (e.g., OSPF/protocol traffic) before the final discard",
            "lo0 filters only work on the backup RE",
            "ICMP must be discarded for OSPF to work"
          ],
          answer: 1, multi: false,
          explanation: "A control-plane (lo0) filter drops anything not explicitly permitted before the terminating discard. Permitting only SSH and ICMP means OSPF (and other essential protocols like BFD, BGP, ARP-adjacent control traffic) is discarded, tearing down adjacencies. The filter must include accept terms for every required control protocol." },
        { id: "D7", domain: "ISIS",
          text: "Two routers should form an IS-IS Level 2 adjacency across a link but stay stuck without adjacency. Their area addresses differ (which is acceptable for L2), and 'show isis interface' shows the interface enabled. Which mismatch would still block the L2 adjacency?",
          options: [
            "Different IS-IS system IDs",
            "A mismatch in the configured level on the interface (one side L1-only, the other L2-only)",
            "Different hostnames",
            "Different loopback addresses"
          ],
          answer: 1, multi: false,
          explanation: "L2 adjacencies ignore area differences, but the interface levels must be compatible. If one side runs L1-only and the other L2-only, no common level exists and no adjacency forms. System IDs must merely be unique (not matching), and hostnames/loopbacks are irrelevant to adjacency formation." },
        { id: "D8", domain: "HA",
          text: "A dual-RE switch performs a Routing Engine switchover during a software issue. Data forwarding continues, but all OSPF and BGP sessions flap and reconverge. GRES is enabled. What would have kept the routing sessions from flapping?",
          options: [
            "Enabling NSR (nonstop active routing) in addition to GRES",
            "Disabling GRES",
            "Configuring VRRP on the uplinks",
            "Lowering the OSPF hello interval"
          ],
          answer: 0, multi: false,
          explanation: "GRES preserves kernel/forwarding state so hardware keeps forwarding, but protocol state is not preserved by GRES alone — hence the sessions flapped. Adding NSR replicates routing-protocol state to the backup RE so OSPF/BGP adjacencies survive the switchover without reconverging (graceful restart is the neighbor-dependent alternative)." },
        { id: "D9", domain: "COS",
          text: "Voice traffic marked EF is experiencing jitter during congestion even though it is classified into the expedited-forwarding class. The scheduler for that class uses a normal transmit-rate with no priority. What change best protects the voice traffic?",
          options: [
            "Increase the interface MTU",
            "Assign the EF scheduler strict-high (or high) priority so it is serviced ahead of other queues",
            "Move voice into best-effort",
            "Disable the classifier"
          ],
          answer: 1, multi: false,
          explanation: "Latency-sensitive voice needs priority scheduling. Giving the EF queue strict-high priority means the scheduler services it ahead of lower-priority queues, minimizing queuing delay and jitter during congestion. Simply having a forwarding class without scheduling priority does not guarantee low latency." },
        { id: "D10", domain: "OSPF",
          text: "An enterprise wants a remote area to receive only a default route from the ABR while still allowing an ASBR located inside that area to inject external routes. Which area type meets both requirements?",
          options: [
            "Totally stubby area",
            "NSSA (optionally totally-stubby NSSA), which blocks Type 5 but allows local Type 7 externals",
            "Standard (normal) area",
            "Backbone area"
          ],
          answer: 1, multi: false,
          explanation: "An NSSA supports a local ASBR (Type 7 externals) while still restricting inbound externals; a totally-stubby NSSA additionally sends just a default route in place of inter-area/external summaries. A totally stubby area forbids any ASBR, and a normal/backbone area does not restrict externals." },
        { id: "D11", domain: "BGP",
          text: "You want your AS to prefer receiving inbound traffic on one of two links from the same upstream provider. Which BGP attribute, advertised to that provider, is the appropriate tool (assuming the provider honors it)?",
          options: [
            "Local preference",
            "MED (multi-exit discriminator)",
            "Weight",
            "Origin code"
          ],
          answer: 1, multi: false,
          explanation: "MED is advertised outbound to a neighboring AS to influence which of several links that neighbor uses to enter your AS (lower MED preferred). Local preference and weight are locally significant and affect your own outbound choice, not the neighbor's inbound decision." },
        { id: "D12", domain: "L2",
          text: "An aggregated Ethernet bundle (ae0) between two switches shows only one member link forwarding and the other in a detached state. LACP is configured active/active. Which check is most relevant?",
          options: [
            "Whether the two member links have matching speed/duplex and both ends agree on the same ae bundle and LACP parameters",
            "Whether an IRB is configured on ae0",
            "Whether storm control is enabled",
            "Whether the bundle uses VRRP"
          ],
          answer: 0, multi: false,
          explanation: "A member that will not join usually has mismatched properties (speed/duplex), is cabled to the wrong peer bundle, or has an LACP configuration/state mismatch. LACP only aggregates links that agree on system/port parameters and are compatible; the odd link is left detached." },
        { id: "D13", domain: "PIR",
          text: "Traffic to a multihomed destination with two equal-cost OSPF paths is only using one path even after you add a load-balancing policy. Which detail is essential for the load balancing to take effect in hardware?",
          options: [
            "The policy must be applied under 'routing-options forwarding-table export'",
            "The policy must be applied as an OSPF import policy",
            "You must configure an aggregate route",
            "You must enable per-prefix damping"
          ],
          answer: 0, multi: false,
          explanation: "Per-flow (Junos 'per-packet') load balancing is programmed into the PFE only when the load-balancing policy is exported to the forwarding table via 'routing-options forwarding-table export'. Applying it as a protocol import policy does not install multiple next hops in hardware." },
        { id: "D14", domain: "STP",
          text: "In an RSTP topology you want to guarantee that a specific distribution switch remains the root bridge even if a new switch with a lower bridge priority is added. Which combination is most appropriate?",
          options: [
            "Configure the distribution switch with the lowest bridge priority and enable root guard on ports facing downstream switches",
            "Enable BPDU protect on the root's uplinks",
            "Set all ports to edge",
            "Increase the hello time on the root"
          ],
          answer: 0, multi: false,
          explanation: "Making the intended root have the lowest bridge priority sets the design, and root guard on downstream-facing ports blocks any port that receives a superior BPDU (root-inconsistent state), preventing a newly added switch from usurping the root role. BPDU protect is for edge/host ports, not for defending root position." },
        { id: "D15", domain: "HA",
          text: "You need sub-second failure detection between two OSPF neighbors across a switched transport where a mid-span failure would not bring down the physical interface. Which feature addresses this?",
          options: [
            "Increasing OSPF dead interval",
            "Enabling BFD for the OSPF adjacency",
            "Enabling GRES",
            "Configuring an aggregate route"
          ],
          answer: 1, multi: false,
          explanation: "When an intermediate L2 device hides a failure, the interface stays up and OSPF relies on slow hello/dead timers. BFD provides a lightweight, sub-second liveness check between the neighbors and signals OSPF to tear down immediately, enabling fast reconvergence." },
        { id: "D16", domain: "POLICY",
          text: "A policy chain is applied as 'import [ policyA policyB ]'. A route is accepted by policyA. Does policyB get evaluated for that route?",
          options: [
            "Yes, both policies always run fully",
            "No — a terminating action (accept) in policyA stops evaluation of the chain for that route",
            "Only if policyB has a 'from' match",
            "Only for BGP routes"
          ],
          answer: 1, multi: false,
          explanation: "In a policy chain, policies are evaluated left to right, but a terminating action (accept/reject) in an earlier policy stops the chain for that route. policyB would only be reached for routes that fall through policyA without a terminating action." },
        { id: "D17", domain: "COS",
          text: "On egress toward a service provider you must ensure your internal DSCP markings are translated to the values the provider expects. Which CoS component performs this on the outbound interface?",
          options: [
            "Behavior aggregate classifier",
            "Rewrite rule",
            "Drop profile",
            "Forwarding class map only"
          ],
          answer: 1, multi: false,
          explanation: "A rewrite rule sets/translates the CoS code points (e.g., DSCP) on packets as they egress an interface, aligning your markings with the provider's scheme. Classifiers act on ingress; drop profiles govern congestion drops." },
        { id: "D18", domain: "ISIS",
          text: "An SP-style enterprise core running IS-IS wants finer-grained traffic engineering with per-link metrics above 63 and future MPLS-TE readiness. Which single configuration change enables the larger metric space?",
          options: [
            "Switch the interfaces to OSPF",
            "Configure wide metrics (wide-metrics-only / the extended metric style)",
            "Raise the reference bandwidth",
            "Enable overload bit"
          ],
          answer: 1, multi: false,
          explanation: "Enabling wide metrics (extended IS reachability TLVs) lifts the per-link metric ceiling from 63 to a much larger range and is a prerequisite for IS-IS TE extensions. Reference bandwidth is an OSPF concept; the overload bit is unrelated to metric width." },
        { id: "D19", domain: "OSPF",
          text: "Given a link where both routers have OSPF interface priority left at the default and one router has a manually configured, higher Router ID, which becomes the DR on a broadcast segment (assuming simultaneous startup)?",
          options: [
            "The router with the lower Router ID",
            "The router with the higher Router ID",
            "Neither; DR election is disabled at default priority",
            "Both become DR"
          ],
          answer: 1, multi: false,
          explanation: "With equal (default) priorities, the DR/BDR election is decided by the highest Router ID (then highest, next highest for BDR). Note that in a live network a router already established as DR is not preempted, but on simultaneous startup the higher Router ID wins." },
        { id: "D20", domain: "BGP",
          text: "You must prevent routes learned from a peering partner from ever being passed on to your transit providers, while still using them internally. Which community best expresses this intent when tagged on those routes?",
          options: [
            "no-advertise",
            "no-export",
            "no-peer only",
            "internet"
          ],
          answer: 1, multi: false,
          explanation: "no-export lets routes propagate within your AS (via IBGP) but stops them from being advertised outside the AS/confederation — exactly 'use internally, don't leak to external transit'. no-advertise would block even internal IBGP propagation, which is too restrictive here." },
        { id: "D21", domain: "L2",
          text: "A security requirement states that a specific access port must learn at most 3 MAC addresses and drop traffic from additional MACs without shutting the port. Which feature and action fit?",
          options: [
            "MAC limiting with the action set to drop (not shutdown)",
            "Storm control with shutdown",
            "802.1X only",
            "Root guard"
          ],
          answer: 0, multi: false,
          explanation: "MAC limiting caps the number of learned MACs per port, and its action can be set to drop packets from MACs beyond the limit while keeping the port up (as opposed to the shutdown action). This meets 'limit to 3, drop excess, don't disable the port'." },
        { id: "D22", domain: "PIR",
          text: "You need to advertise a single summary prefix to a neighbor but only while at least one specific component subnet is present in the table, and you want the summary to carry a usable forwarding next hop rather than reject. Which route type should you use?",
          options: [
            "Aggregate route",
            "Generated route",
            "Static discard route",
            "Martian route"
          ],
          answer: 1, multi: false,
          explanation: "A generated route activates only when a contributing route exists AND inherits the next hop of its primary contributor, giving a real forwarding path. An aggregate route also depends on a contributor but defaults to a reject next hop, which would black-hole traffic rather than forward it." },
        { id: "D23", domain: "HA",
          text: "Two gateways share VRRP for a subnet. You want the higher-capacity router to be master, and you want mastership to move to the backup if that router's WAN uplink fails. Which VRRP capability provides the failover-on-uplink behavior?",
          options: [
            "Setting both routers to the same priority",
            "Interface/track-based priority reduction (tracking the WAN interface) so priority drops below the backup on failure",
            "Lowering the advertisement interval",
            "Disabling preempt"
          ],
          answer: 1, multi: false,
          explanation: "VRRP interface tracking lowers the master's effective priority when a tracked (WAN) interface goes down; once it falls below the backup's priority, the backup takes over. Assigning the higher-capacity router a higher base priority makes it master normally." },
        { id: "D24", domain: "POLICY",
          text: "A firewall filter term counts and accepts management traffic, but you notice the counter never increments even though management sessions work. The term is placed after a broad 'then accept' term. What is wrong?",
          options: [
            "Counters require a policer",
            "An earlier terminating 'accept' matches the traffic first, so the later counting term is never reached",
            "Counters only work on egress",
            "The filter must be applied to lo0"
          ],
          answer: 1, multi: false,
          explanation: "Firewall filters stop at the first matching terminating action. A broad 'then accept' earlier in the filter matches the management traffic and ends evaluation, so the later term that counts never sees the packets. Reorder so the specific counting term precedes the broad accept." },
        { id: "D25", domain: "OSPF",
          text: "During a maintenance window you raise the OSPF reference bandwidth on only one router to 100g while its neighbors keep the default. What is the practical consequence?",
          options: [
            "Adjacencies will drop due to the mismatch",
            "Only that router's cost calculations change, which can cause asymmetric/suboptimal routing; reference bandwidth should be consistent network-wide",
            "The whole area recalculates automatically to match",
            "It has no effect at all"
          ],
          answer: 1, multi: false,
          explanation: "Reference bandwidth is locally significant to cost computation and is not exchanged, so adjacencies stay up — but inconsistent values produce inconsistent link costs and potentially asymmetric or suboptimal paths. Best practice is to set the same reference bandwidth on all routers." }
      ]
    },
    // ============================================================
    {
      id: "ENT-E",
      name: "Mock Exam E — Configuration & Design",
      description: "Configuration-oriented and design-choice questions, plus a few config-snippet reads.",
      questions: [
        { id: "E1", domain: "L2",
          text: "You configure: 'set interfaces ge-0/0/5 unit 0 family ethernet-switching interface-mode access vlan members 30'. A phone and a PC (PC behind the phone) must both work, with the PC untagged and the phone in a voice VLAN. What must change?",
          options: [
            "Nothing; access mode supports two VLANs automatically",
            "Change the port to trunk (or add voice VLAN support) so it carries the untagged data VLAN plus the tagged voice VLAN",
            "Add an IRB for VLAN 30",
            "Enable MACsec"
          ],
          answer: 1, multi: false,
          explanation: "A pure access port carries a single untagged VLAN. To support a data device untagged plus a voice device tagged, the port must carry both — typically a trunk with the data VLAN as native/untagged and the voice VLAN tagged (or an explicit voice-VLAN configuration). Access mode alone cannot carry both." },
        { id: "E2", domain: "OSPF",
          text: "Design goal: minimize LSA flooding into branch areas that have no transit role and no local ASBRs, sending them just a default route. Which area type is the most restrictive fit?",
          options: [
            "NSSA",
            "Totally stubby area",
            "Normal area with summarization",
            "Backbone area"
          ],
          answer: 1, multi: false,
          explanation: "A totally stubby area blocks Type 3 (inter-area), Type 4, and Type 5 (external) LSAs, replacing them with a single default route from the ABR — the most restrictive option for a stub branch with no ASBR. NSSA would be chosen only if the branch needs to originate externals." },
        { id: "E3", domain: "BGP",
          text: "In a 40-router IBGP domain, full mesh is unmanageable. You choose route reflection. Which loop-prevention attributes must the reflectors rely on?",
          options: [
            "AS-path and MED",
            "ORIGINATOR_ID and CLUSTER_LIST",
            "Local preference and weight",
            "Community and aggregator"
          ],
          answer: 1, multi: false,
          explanation: "Because reflected IBGP routes cannot use AS-path (the AS is unchanged), route reflectors use ORIGINATOR_ID (the router that first injected the route) and CLUSTER_LIST (the reflector clusters traversed) to detect and drop loops." },
        { id: "E4", domain: "POLICY",
          text: "You must redistribute connected (direct) routes into OSPF, but only the loopback and the management subnet — nothing else. Which policy structure is correct?",
          options: [
            "One term: 'from protocol direct; then accept'",
            "A term matching 'from protocol direct' plus route-filters for the loopback and management prefixes, then accept; applied as OSPF export",
            "Apply the policy as an OSPF import policy",
            "Use an aggregate route instead"
          ],
          answer: 1, multi: false,
          explanation: "Redistribution into OSPF is done with an export policy that both matches the source (protocol direct) and narrows to the exact prefixes via route-filter before accept. A bare 'from protocol direct; then accept' would leak all connected routes; import policy does not control what OSPF originates." },
        { id: "E5", domain: "COS",
          text: "You want four classes with strict priority for network-control, low latency for voice, a guaranteed share for business data, and the rest best-effort. Which mapping element ties each forwarding class to its scheduler?",
          options: [
            "A classifier",
            "A scheduler-map (binding schedulers to forwarding classes), referenced under the interface's CoS",
            "A rewrite rule",
            "A drop profile"
          ],
          answer: 1, multi: false,
          explanation: "A scheduler-map associates each forwarding class with a scheduler (defining priority, transmit-rate, buffer, drop profile). The map is then applied to the interface. Classifiers assign ingress packets to classes; rewrite rules re-mark; drop profiles define RED behavior." },
        { id: "E6", domain: "ISIS",
          text: "Design: a two-level IS-IS network where an aggregation router must exchange routes with both the backbone and a local area. How should its interfaces be configured?",
          options: [
            "All interfaces L1-only",
            "The router as Level 1-2, with backbone-facing links at L2 and local-area links at L1",
            "All interfaces L2-only",
            "Disable IS-IS levels entirely"
          ],
          answer: 1, multi: false,
          explanation: "A Level 1-2 router bridges an area (L1) to the backbone (L2). Configuring backbone links at L2 and intra-area links at L1 lets it participate in both and perform L1/L2 route leaking, analogous to an OSPF ABR." },
        { id: "E7", domain: "HA",
          text: "Requirement: during planned Junos upgrades, forwarding must continue and OSPF/BGP neighbors must not see the router go down. Which feature set should be enabled?",
          options: [
            "GRES + NSR (and, for upgrades, unified ISSU where supported)",
            "VRRP only",
            "BFD only",
            "Storm control"
          ],
          answer: 0, multi: false,
          explanation: "GRES preserves forwarding across an RE switchover, NSR preserves routing-protocol state so neighbors never see a flap, and unified ISSU leverages both to upgrade with minimal disruption. VRRP and BFD address different problems (gateway redundancy, fast detection)." },
        { id: "E8", domain: "PIR",
          text: "You need a default route that is only used when a more-specific learned route to a monitored prefix disappears, and you want the default itself to point at a real gateway. Which approach is cleanest?",
          options: [
            "A static default route with a next hop plus route dependency (e.g., via BFD/next-hop liveness) so it withdraws appropriately",
            "An aggregate 0.0.0.0/0 with reject",
            "A martian entry",
            "A generated route with no contributors"
          ],
          answer: 0, multi: false,
          explanation: "A static default with a real next hop (optionally tied to next-hop liveness/BFD) provides a usable gateway and predictable behavior. An aggregate default would reject/black-hole traffic, and a generated route needs contributors to activate — neither gives a clean, always-usable default gateway." },
        { id: "E9", domain: "STP",
          text: "In a mixed environment you must interoperate spanning tree with Cisco switches running Rapid-PVST+ so that per-VLAN topologies are honored. Which Junos protocol do you deploy?",
          options: [
            "MSTP",
            "VSTP",
            "RSTP (single instance)",
            "STP (802.1D)"
          ],
          answer: 1, multi: false,
          explanation: "VSTP maintains a spanning-tree instance per VLAN and interoperates with Cisco PVST+/Rapid-PVST+. MSTP maps VLANs into a few instances and requires matching MST region config to interoperate; single-instance RSTP/STP would not honor per-VLAN topologies." },
        { id: "E10", domain: "OSPF",
          text: "Config snippet: area 0.0.0.10 is defined as 'stub'. A router in area 10 has 'set protocols ospf area 10 stub default-metric 20'. What does default-metric 20 do?",
          options: [
            "Sets the cost of all interfaces in area 10 to 20",
            "Sets the metric of the default route the ABR injects into the stub area",
            "Blocks LSAs with metric above 20",
            "Sets the OSPF reference bandwidth"
          ],
          answer: 1, multi: false,
          explanation: "In a stub area, the ABR injects a default route; 'stub default-metric 20' sets the cost of that injected default route as seen within the stub area. It does not change interface costs or reference bandwidth." },
        { id: "E11", domain: "BGP",
          text: "Two IBGP routers are configured, but the session stays in Active/Connect. Loopbacks are used as the source, reachable via OSPF. Which configuration is most likely missing?",
          options: [
            "multihop (IBGP does not need it) — so instead check 'local-address' set to the loopback and that both peer statements point to each other's loopback",
            "A route reflector",
            "An export policy",
            "family inet-vpn"
          ],
          answer: 0, multi: false,
          explanation: "IBGP over loopbacks needs each side's 'local-address' set to its own loopback and the neighbor address set to the peer's loopback (with IGP reachability). IBGP does not require multihop. If local-address/neighbor addressing is inconsistent, TCP never establishes and the session sits in Active/Connect." },
        { id: "E12", domain: "L2",
          text: "Design: you want a Layer 3 gateway for VLAN 50 on a switch and inter-VLAN routing between VLAN 50 and VLAN 60. What must you configure?",
          options: [
            "A trunk port for each VLAN",
            "An IRB (irb) interface with an IP address per VLAN, and the VLAN's 'l3-interface' pointing to it",
            "MACsec on the uplink",
            "A LAG between the VLANs"
          ],
          answer: 1, multi: false,
          explanation: "Inter-VLAN routing on a switch uses IRB interfaces: create irb units with IP addresses for VLAN 50 and 60 and associate each VLAN with its IRB (l3-interface). The switch then routes between the two VLANs at Layer 3." },
        { id: "E13", domain: "POLICY",
          text: "A policer must limit inbound traffic on a customer port to 100 Mbps with a 100 KB burst, discarding excess. Where is the policer referenced to apply it?",
          options: [
            "Directly under 'protocols ospf'",
            "In a firewall filter term via 'then policer <name>', with the filter applied to the interface",
            "Under 'routing-options aggregate'",
            "In the VRRP group"
          ],
          answer: 1, multi: false,
          explanation: "You define the policer (bandwidth-limit/burst-size-limit + discard) and reference it from a firewall filter term's action ('then policer name'); the filter is applied to the interface input. That enforces the rate on inbound customer traffic." },
        { id: "E14", domain: "HA",
          text: "You enable BFD for a BGP session with a 300 ms interval and multiplier 3. What failure-detection time does this configure, approximately?",
          options: [
            "About 900 ms (interval × multiplier)",
            "About 100 ms",
            "About 3 seconds",
            "About 30 seconds"
          ],
          answer: 0, multi: false,
          explanation: "BFD detection time ≈ interval × multiplier = 300 ms × 3 = 900 ms. This is far faster than BGP's default hold timer, giving sub-second failure detection for the session." },
        { id: "E15", domain: "COS",
          text: "You configure a scheduler with 'transmit-rate percent 30' and another with 'transmit-rate percent 30 exact'. During congestion, which queue can use spare bandwidth beyond 30%?",
          options: [
            "The one WITHOUT 'exact' (it may borrow unused bandwidth)",
            "The one WITH 'exact'",
            "Neither can exceed 30%",
            "Both share equally regardless"
          ],
          answer: 0, multi: false,
          explanation: "Without 'exact', the transmit-rate is a guaranteed minimum and the queue can borrow unused bandwidth from other queues. 'exact' caps the queue at exactly the configured rate, preventing it from using spare capacity." },
        { id: "E16", domain: "PIR",
          text: "Design: you must import specific OSPF routes into a second routing table used by a separate service without redistributing them back. Which mechanism installs the routes into multiple tables?",
          options: [
            "A rib-group applied to OSPF (import-rib listing the target tables)",
            "An aggregate route",
            "A firewall filter",
            "A rewrite rule"
          ],
          answer: 0, multi: false,
          explanation: "A rib-group lets a protocol install its routes into more than one routing table (import-rib list). Applying an OSPF rib-group leaks the chosen OSPF routes into the additional table without a redistribution loop." },
        { id: "E17", domain: "OSPF",
          text: "Two areas are physically separated from area 0 because a new area 20 sits between them and the backbone. Which OSPF feature restores backbone continuity without renumbering?",
          options: [
            "A virtual link across area 20 to area 0",
            "Converting area 20 to a stub",
            "Enabling NSSA on area 0",
            "Adding a second Router ID"
          ],
          answer: 0, multi: false,
          explanation: "A virtual link tunnels backbone connectivity across a non-backbone transit area (area 20 here) to reconnect a discontiguous area to area 0. Stub/NSSA settings do not repair backbone continuity." },
        { id: "E18", domain: "BGP",
          text: "You want your AS to appear less preferred for inbound traffic on a backup EBGP link without using MED (the provider ignores MED). Which common technique influences the upstream's path selection instead?",
          options: [
            "AS-path prepending on the backup link's advertisements",
            "Raising local preference outbound",
            "Setting origin to IGP",
            "Enabling damping"
          ],
          answer: 0, multi: false,
          explanation: "Prepending your own AS several times on the backup link lengthens the AS-path, making that path less preferred by upstreams that rely on AS-path length (a very common inbound traffic-engineering method when MED is not honored). Local preference is only locally significant." },
        { id: "E19", domain: "L2",
          text: "To reduce manual VLAN pruning on trunks in a campus, you enable a protocol that dynamically advertises which VLANs are active and prunes the rest. Which protocol is it, and a caution?",
          options: [
            "MVRP; caution: dynamic changes can affect the L2 topology, so control which trunks participate",
            "LLDP; caution: it powers PoE",
            "LACP; caution: it bundles links",
            "STP; caution: it blocks ports"
          ],
          answer: 0, multi: false,
          explanation: "MVRP dynamically registers/prunes VLANs across participating trunks, reducing manual pruning. Because it changes which VLANs traverse trunks automatically, you should scope which interfaces participate to avoid unintended L2 topology changes." },
        { id: "E20", domain: "HA",
          text: "For a pair of core routers you must provide a redundant default gateway to a server subnet AND detect gateway failure quickly. Which pairing of features is appropriate?",
          options: [
            "VRRP for the virtual gateway, with BFD (or interface tracking) for fast failure detection/failover",
            "NSR and GRES only",
            "MSTP and RSTP",
            "LDP and RSVP"
          ],
          answer: 0, multi: false,
          explanation: "VRRP presents the redundant virtual gateway IP; adding BFD or interface tracking to the VRRP/uplink lets mastership move quickly on failure. NSR/GRES are intra-chassis RE features, not first-hop gateway redundancy." },
        { id: "E21", domain: "POLICY",
          text: "Config read: a policy has term1 'from route-filter 10.0.0.0/8 orlonger; then reject' and term2 'then accept'. What is the effect on 10.1.2.0/24?",
          options: [
            "Accepted by term2",
            "Rejected by term1 because /24 is longer-or-equal within 10.0.0.0/8",
            "Ignored entirely",
            "Sent to the martian list"
          ],
          answer: 1, multi: false,
          explanation: "'10.0.0.0/8 orlonger' matches 10.0.0.0/8 and any more-specific prefix inside it, including 10.1.2.0/24. term1 matches and rejects, so term2 is never reached for that route." },
        { id: "E22", domain: "ISIS",
          text: "You suspect an IS-IS router is intentionally advertising itself as unusable for transit during maintenance, so traffic avoids transiting it but still reaches its directly connected prefixes. Which mechanism produces this?",
          options: [
            "The IS-IS overload bit",
            "Wide metrics",
            "A stub area",
            "BPDU protect"
          ],
          answer: 0, multi: false,
          explanation: "Setting the IS-IS overload bit tells other routers not to use this node as a transit path (its transit metric becomes effectively unusable) while still allowing traffic to its own connected routes — ideal during maintenance or before full convergence." },
        { id: "E23", domain: "COS",
          text: "During congestion you want low-priority bulk traffic to start dropping earlier and more aggressively than interactive traffic, avoiding tail drop. Which mechanism do you tune per class?",
          options: [
            "Classifier code points",
            "Drop profiles (RED/WRED) with different fill-level/drop-probability curves per forwarding class",
            "Rewrite rules",
            "Reference bandwidth"
          ],
          answer: 1, multi: false,
          explanation: "Drop profiles implement (W)RED: by assigning bulk traffic a more aggressive curve (drops begin at lower queue fill), you manage congestion proactively and protect interactive traffic, avoiding synchronized tail drop." },
        { id: "E24", domain: "OSPF",
          text: "A summary (Type 3) route from another area keeps flapping and destabilizing SPF. You want the ABR to advertise one stable summary instead of many specifics. Which OSPF configuration achieves inter-area summarization on the ABR?",
          options: [
            "area-range on the ABR for the area containing the specifics",
            "A totally stubby area on the backbone",
            "Increasing hello timers",
            "An lo0 firewall filter"
          ],
          answer: 0, multi: false,
          explanation: "Configuring an 'area-range' on the ABR aggregates the intra-area prefixes into a single Type 3 summary advertised to other areas, hiding churn of the specifics and stabilizing SPF elsewhere." },
        { id: "E25", domain: "PIR",
          text: "You must ensure return traffic for a directly attached test subnet is silently dropped (not ICMP-unreachable) for a maintenance test, using a route rather than a filter. Which static route configuration fits?",
          options: [
            "A static route to the subnet with next-hop discard",
            "A static route with next-hop reject",
            "An aggregate route",
            "A generated route"
          ],
          answer: 0, multi: false,
          explanation: "next-hop 'discard' silently drops matching traffic, whereas 'reject' drops and returns an ICMP unreachable. For a silent drop the discard next hop is correct; aggregate/generated routes are for summarization, not per-prefix blackholing behavior control." }
      ]
    },
    // ============================================================
    {
      id: "ENT-F",
      name: "Mock Exam F — Mixed Rapid 15",
      description: "A shorter 15-question mixed-difficulty set spanning the whole blueprint.",
      questions: [
        { id: "F1", domain: "OSPF",
          text: "Which OSPF LSA type does an ASBR originate to describe routes redistributed from outside the OSPF domain into a normal area?",
          options: ["Type 1", "Type 2", "Type 3", "Type 5"],
          answer: 3, multi: false,
          explanation: "Type 5 AS-External LSAs are originated by an ASBR to describe external (redistributed) routes and are flooded throughout the OSPF domain except into stub/NSSA areas." },
        { id: "F2", domain: "BGP",
          text: "Which is TRUE about the BGP Local Preference attribute?",
          options: [
            "It is exchanged with EBGP peers to influence their choice",
            "It is shared among IBGP routers within an AS and influences outbound path selection",
            "It is a per-link metric like OSPF cost",
            "It cannot be changed by policy"
          ],
          answer: 1, multi: false,
          explanation: "Local preference is propagated among IBGP routers within the AS and is the first major tiebreaker (higher wins), steering the AS's outbound path choice. It is not sent to EBGP peers and is readily set via policy." },
        { id: "F3", domain: "L2",
          text: "A frame arrives untagged on a Junos trunk port. Which VLAN is it associated with?",
          options: [
            "It is dropped",
            "The port's native VLAN",
            "VLAN 1 always",
            "The highest-numbered member VLAN"
          ],
          answer: 1, multi: false,
          explanation: "Untagged frames received on a trunk are placed into the configured native VLAN. If no native VLAN is set, behavior depends on configuration, but the intended mechanism is the native-vlan-id." },
        { id: "F4", domain: "STP",
          text: "Which statement best describes the difference between RSTP alternate and backup port roles?",
          options: [
            "Alternate provides an alternate path to the root; backup is a redundant connection to the same segment as a designated port",
            "They are identical",
            "Alternate is always forwarding; backup is always root",
            "Backup connects to the root bridge directly"
          ],
          answer: 0, multi: false,
          explanation: "An alternate port offers an alternate path toward the root (backing up the root port), while a backup port provides redundancy to the same segment already served by a designated port on the same bridge." },
        { id: "F5", domain: "PIR",
          text: "Which Junos next-hop type in a static route returns an ICMP unreachable to the sender?",
          options: ["discard", "reject", "receive", "resolve"],
          answer: 1, multi: false,
          explanation: "'reject' drops the packet and sends an ICMP unreachable back to the source. 'discard' drops silently with no ICMP response." },
        { id: "F6", domain: "POLICY",
          text: "In Junos, the default action at the end of every routing policy (if no term terminates) is determined by what?",
          options: [
            "Always accept",
            "Always reject",
            "The default policy for the specific protocol the policy is applied to",
            "The martian list"
          ],
          answer: 2, multi: false,
          explanation: "If a policy does not reach a terminating action, the protocol's default policy applies (e.g., BGP accepts received routes by default; OSPF/IS-IS do not import externals by default). The final action is therefore protocol-dependent." },
        { id: "F7", domain: "COS",
          text: "Which best describes a behavior-aggregate (BA) classifier?",
          options: [
            "It classifies based on a firewall-filter match of multiple fields",
            "It classifies packets into forwarding classes based on a single CoS field such as DSCP, IP precedence, or 802.1p",
            "It rewrites egress markings",
            "It shapes the interface rate"
          ],
          answer: 1, multi: false,
          explanation: "A BA classifier maps a single code-point field (DSCP/IP-prec/EXP/802.1p) to a forwarding class and loss priority. Multifield classification (matching several header fields) is done with a firewall filter instead." },
        { id: "F8", domain: "HA",
          text: "Which HA technology is host-facing (first-hop redundancy) rather than intra-router?",
          options: ["GRES", "NSR", "VRRP", "Graceful restart"],
          answer: 2, multi: false,
          explanation: "VRRP provides a redundant default gateway for hosts (first-hop redundancy). GRES, NSR, and graceful restart are about surviving Routing Engine switchovers/restarts within or between routers." },
        { id: "F9", domain: "ISIS",
          text: "Which pair of IS-IS PDUs handles LSP database synchronization?",
          options: [
            "IIH and BPDU",
            "CSNP and PSNP",
            "Hello and DBD",
            "LSU and LSAck"
          ],
          answer: 1, multi: false,
          explanation: "CSNPs (complete sequence number PDUs) summarize the LSP database and PSNPs (partial) request or acknowledge specific LSPs, together keeping databases synchronized. DBD/LSU/LSAck are OSPF terms." },
        { id: "F10", domain: "OSPF",
          text: "On which OSPF network types is no DR/BDR elected?",
          options: [
            "Broadcast",
            "Point-to-point",
            "NBMA",
            "All types elect a DR"
          ],
          answer: 1, multi: false,
          explanation: "Point-to-point links form a single adjacency and elect no DR/BDR. Broadcast and NBMA network types perform DR/BDR election to reduce the number of adjacencies on the segment." },
        { id: "F11", domain: "BGP",
          text: "You see a BGP route with Origin code 'Incomplete'. What does that usually indicate?",
          options: [
            "The route was learned via IBGP",
            "The route was redistributed into BGP (e.g., from an IGP or static) rather than originated with 'network'/aggregate",
            "The route has the shortest AS-path",
            "The route is invalid"
          ],
          answer: 1, multi: false,
          explanation: "Origin 'Incomplete' (?) typically means the route entered BGP through redistribution, as opposed to IGP origin (originated via network/aggregate) or the legacy EGP origin. In path selection, IGP is preferred over Incomplete." },
        { id: "F12", domain: "L2",
          text: "Which Junos feature protects against a Layer 2 broadcast storm by rate-limiting BUM traffic on a port?",
          options: ["Root guard", "Storm control", "MAC limiting", "BPDU protect"],
          answer: 1, multi: false,
          explanation: "Storm control rate-limits broadcast, unknown-unicast, and multicast (BUM) traffic against a configured level and can optionally take action if exceeded, mitigating broadcast storms. The others address root position, MAC counts, and edge BPDUs respectively." },
        { id: "F13", domain: "PIR",
          text: "Which routing table would you inspect to confirm the router installed a learned IPv6 unicast route?",
          options: ["inet.0", "inet6.0", "mpls.0", "inet.3"],
          answer: 1, multi: false,
          explanation: "IPv6 unicast routes live in inet6.0. inet.0 is IPv4 unicast, mpls.0 holds label routes, and inet.3 holds MPLS/tunnel next hops for BGP resolution." },
        { id: "F14", domain: "STP",
          text: "Why might you deploy MSTP instead of VSTP in a large campus with hundreds of VLANs?",
          options: [
            "MSTP runs one instance per VLAN for maximum granularity",
            "MSTP maps many VLANs onto a few instances, drastically reducing CPU/BPDU overhead at scale",
            "MSTP disables spanning tree",
            "MSTP is required for access ports"
          ],
          answer: 1, multi: false,
          explanation: "VSTP's per-VLAN instances do not scale to hundreds of VLANs. MSTP groups VLANs into a small number of instances (MSTIs), sharply cutting the number of spanning-tree computations and BPDUs while still allowing load distribution across instances." },
        { id: "F15", domain: "POLICY",
          text: "A multifield firewall filter must match traffic by both destination port and source prefix to rate-limit it. Which construct is required that a behavior-aggregate classifier cannot provide?",
          options: [
            "A rewrite rule",
            "A firewall filter term matching multiple fields (multifield classification), then a policer action",
            "An aggregate route",
            "An area-range"
          ],
          answer: 1, multi: false,
          explanation: "Matching several header fields (source prefix + destination port) is multifield classification, done with a firewall filter term; combining that match with a 'then policer' action enforces the rate. A BA classifier only reads a single CoS code point." }
      ]
    }
  ];

  if (typeof ENT_CERT !== "undefined" && ENT_CERT && Array.isArray(ENT_CERT.exams)) {
    ENT_CERT.exams = ENT_CERT.exams.concat(NEW_ENT_EXAMS);
  }
  if (typeof module !== "undefined") { module.exports = { NEW_ENT_EXAMS: NEW_ENT_EXAMS }; }
})();
