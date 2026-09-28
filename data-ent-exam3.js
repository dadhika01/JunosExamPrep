/*
 * JNCIS-ENT (JN0-352) — Full-length Voucher-Style Mock Exam #3 (HARD).
 * 60 questions, 90-minute fixed clock (timeLimitSec: 5400).
 *
 * Tough/tricky, exam-realistic: exhibit interpretation, multi-step reasoning,
 * subtle distractors, edge cases, "choose two".
 *
 * Weighting: STP 9, OSPF 10, L2 switching 7, L2 security/filters 7,
 * BGP 8, IS-IS 6, PIR 5, HA/tunnels 8 = 60.
 *
 * Rules: no repeats of any existing ENT question; correct-answer length
 * decoupled from correctness; exhibits use q.exhibit. data.js balances positions.
 *
 * Appends after ENT-VOUCHER-2 in ENT_CERT.exams.
 */
(function () {
  var EXAM = {
    id: "ENT-VOUCHER-3",
    name: "★ Full Mock 3 — 60 Q / 90 min (Hard)",
    description: "Third full-length exam — hard and tricky: exhibits, multi-step scenarios, and edge-case distractors across the full ENT blueprint. 60 questions, 90-minute clock.",
    timeLimitSec: 5400,
    questions: [
      // ================= SPANNING TREE (9) =================
      { id: "X1", domain: "STP",
        text: "Referring to the exhibit, an operator wants SW-CORE to be root for VLAN 100 but SW-DIST is winning. Bridge priorities are equal. What single change most reliably makes SW-CORE the root?",
        exhibit:
"VSTP VLAN 100:\n" +
"  SW-CORE  priority 32768  MAC 00:10:00:00:00:aa\n" +
"  SW-DIST  priority 32768  MAC 00:10:00:00:00:05  (currently root)",
        options: [
          "Lower SW-CORE's bridge priority for VLAN 100 (e.g., to 4096)",
          "Change SW-CORE's MAC address",
          "Raise SW-DIST's port cost",
          "Enable BPDU protect on SW-CORE"
        ],
        answer: 0, multi: false,
        explanation: "With equal priorities the lower MAC (SW-DIST) wins, so SW-DIST is root. Explicitly lowering SW-CORE's bridge priority for that VLAN makes its bridge ID lowest and guarantees the root role — the standard, deterministic method. You cannot rely on changing MACs or costs for root election." },
      { id: "X2", domain: "STP",
        text: "Which statement about RSTP BPDU handling differs from legacy 802.1D?",
        options: [
          "In RSTP every bridge generates and sends its own BPDUs every hello interval, rather than only relaying the root's BPDUs",
          "RSTP does not use BPDUs at all",
          "RSTP BPDUs are sent only by the root bridge",
          "RSTP uses TCN BPDUs exclusively"
        ],
        answer: 0, multi: false,
        explanation: "In RSTP, each bridge originates its own BPDUs every hello interval (as keepalives), so the loss of BPDUs is detected quickly. In 802.1D non-root bridges essentially relayed the root's BPDUs, which slowed failure detection." },
      { id: "X3", domain: "STP",
        text: "Referring to the exhibit, ge-0/0/7 is shown as 'BLK (bpdu-inconsistent)'. What triggered this and how does it recover?",
        exhibit:
"user@sw> show spanning-tree interface\n" +
"  ge-0/0/7   ---   ---   BLK  (bpdu-inconsistent)   edge, bpdu-block-on-edge",
        options: [
          "A BPDU was received on a BPDU-protected edge port; it recovers on clear or after a configured disable-timeout",
          "The port lost its root role; it recovers when a new root is elected",
          "The MAC table filled; it recovers after aging",
          "MACsec failed; it recovers after rekey"
        ],
        answer: 0, multi: false,
        explanation: "'bpdu-inconsistent' on an edge port with bpdu-block means BPDU protect fired because a BPDU arrived on that edge port. Recovery is manual (clear) or automatic only if a disable-timeout is configured. It is unrelated to root election, MAC aging, or MACsec." },
      { id: "X4", domain: "STP",
        text: "You must run spanning tree that scales to 500 VLANs with minimal instances while still allowing two forwarding topologies for load distribution. Which protocol and design fits best?",
        options: [
          "MSTP with the 500 VLANs mapped across two MST instances",
          "VSTP with one instance per VLAN",
          "RSTP single instance",
          "STP with per-port cost tuning only"
        ],
        answer: 0, multi: false,
        explanation: "MSTP maps many VLANs into a few instances; using two MSTIs lets you split VLANs across two loop-free topologies for load distribution, scaling far better than 500 VSTP instances. Single-instance RSTP/STP cannot provide per-group topologies." },
      { id: "X5", domain: "STP",
        text: "A blocking (alternate) port suddenly moves to forwarding after its neighbor stops sending BPDUs due to a one-way fiber fault, creating a loop. Which feature prevents exactly this?",
        options: [
          "Loop protect",
          "Root guard",
          "BPDU protect",
          "MAC limiting"
        ],
        answer: 0, multi: false,
        explanation: "Loop protect keeps a non-designated port from transitioning to forwarding when the expected BPDUs stop arriving (as in a unidirectional link failure), preventing the loop. Root guard reacts to superior BPDUs; BPDU protect reacts to any BPDU on an edge port." },
      { id: "X6", domain: "STP",
        text: "Referring to the exhibit, what is the port role and state of ge-0/0/2 on the ROOT bridge?",
        exhibit:
"This bridge is the root bridge for the instance.\n" +
"ge-0/0/1: connects to SW-B\n" +
"ge-0/0/2: connects to SW-C",
        options: [
          "Designated / forwarding (all ports on the root bridge are designated)",
          "Root / forwarding",
          "Alternate / blocking",
          "Backup / blocking"
        ],
        answer: 0, multi: false,
        explanation: "On the root bridge every active port is a designated port in the forwarding state — the root has no root port and (absent same-segment redundancy) no alternate/backup ports. So ge-0/0/2 is designated/forwarding." },
      { id: "X7", domain: "STP",
        text: "Which two are valid reasons to configure an interface as an RSTP edge port? (Choose two.)",
        options: [
          "The port connects to an end host and should reach forwarding immediately",
          "You want to avoid generating topology-change events when the host link flaps",
          "The port connects to another switch carrying BPDUs",
          "You want the port to always be the root port"
        ],
        answer: [0, 1], multi: true,
        explanation: "Edge ports are for host-facing links so they forward immediately and their up/down transitions do not trigger topology-change churn. They are NOT for switch-to-switch links (which exchange BPDUs), and edge status has nothing to do with becoming the root port." },
      { id: "X8", domain: "STP",
        text: "During reconvergence you observe a brief traffic loss on host ports even though they are edge ports. Which behavior explains the loss NOT being due to STP transitions?",
        options: [
          "Edge ports do not go through listening/learning, so the loss is from MAC-table flushing/relearning elsewhere, not the edge port's state",
          "Edge ports block during every topology change",
          "Edge ports run the full 802.1D timers",
          "Edge ports become root ports during convergence"
        ],
        answer: 0, multi: false,
        explanation: "Edge ports skip listening/learning and keep forwarding, so any brief loss is due to MAC flushing/relearning in the reconverging topology, not the edge port changing state. This distinguishes edge-port behavior from normal STP ports." },
      { id: "X9", domain: "STP",
        text: "What does the RSTP 'sync' process accomplish immediately after a bridge accepts a superior BPDU on a new root port?",
        options: [
          "It blocks its non-edge designated ports until they re-negotiate, preventing a transient loop while the topology settles",
          "It forwards on all ports instantly",
          "It elects a new root bridge",
          "It flushes the entire configuration"
        ],
        answer: 0, multi: false,
        explanation: "When a bridge selects a new root port, the sync process temporarily blocks its other non-edge designated ports and re-runs proposal/agreement so it can safely bring them back to forwarding without creating a transient loop during rapid convergence." },

      // ================= OSPF (10) =================
      { id: "X10", domain: "OSPF",
        text: "Referring to the exhibit, the neighbor never progresses past Init. What is the cause?",
        exhibit:
"user@r1> show ospf neighbor\n" +
"  Address     Intf         State  ID          Pri  Dead\n" +
"  10.0.0.2    ge-0/0/0.0   Init   10.0.0.2    128   38\n" +
"On r2, an input firewall filter on ge-0/0/0 discards OSPF from 10.0.0.1.",
        options: [
          "r2 is discarding r1's Hellos, so r1 never appears in r2's Hello and the adjacency is one-way (stuck in Init)",
          "The dead interval is too short",
          "The priority is 128",
          "r1 is in a stub area"
        ],
        answer: 0, multi: false,
        explanation: "Init means r1 hears r2 but is not listed in r2's Hello. Because r2's input filter drops r1's OSPF Hellos, r2 never sees r1, so the neighbor stays one-way (Init) from r1's perspective. Removing/permitting OSPF in the filter fixes it." },
      { id: "X11", domain: "OSPF",
        text: "An NSSA has a local ASBR redistributing statics. Which LSA does that ASBR originate inside the NSSA, and what does the ABR do with it?",
        options: [
          "Type 7; the ABR translates selected Type 7 LSAs into Type 5 for the rest of the domain",
          "Type 5; the ABR floods it unchanged",
          "Type 3; the ABR blocks it",
          "Type 1; the ABR summarizes it"
        ],
        answer: 0, multi: false,
        explanation: "In an NSSA a local ASBR originates Type 7 external LSAs (Type 5 are not allowed inside an NSSA). The ABR translates chosen Type 7 LSAs into Type 5 LSAs so the externals propagate to the rest of the OSPF domain." },
      { id: "X12", domain: "OSPF",
        text: "Referring to the exhibit, R1 shows two equal-cost paths to 10.9.9.0/24 but forwards on only one. What must be added to use both?",
        exhibit:
"user@r1> show route 10.9.9.0/24\n" +
"  10.9.9.0/24  *[OSPF/10] via ge-0/0/1.0\n" +
"                        > via ge-0/0/2.0    (equal cost, not active)",
        options: [
          "A load-balancing policy applied under routing-options forwarding-table export",
          "A second OSPF area",
          "An aggregate route",
          "A higher reference bandwidth"
        ],
        answer: 0, multi: false,
        explanation: "OSPF put both ECMP paths in the RIB, but Junos installs one active next hop by default. A per-flow load-balancing policy exported to the forwarding table installs both next hops in the PFE. Areas/aggregates/reference bandwidth do not enable ECMP forwarding." },
      { id: "X13", domain: "OSPF",
        text: "Which statement about OSPF virtual links is correct?",
        options: [
          "A virtual link must transit a non-backbone, non-stub area and logically extends area 0 across it",
          "A virtual link can transit a stub area",
          "A virtual link connects two different autonomous systems",
          "A virtual link replaces the need for a Router ID"
        ],
        answer: 0, multi: false,
        explanation: "A virtual link repairs backbone connectivity by traversing a standard (transit) non-backbone area; it cannot transit a stub/NSSA area (those cannot carry the required LSAs). It logically extends area 0, not connects ASes." },
      { id: "X14", domain: "OSPF",
        text: "Referring to the exhibit, why is R3 NOT becoming the DR despite the highest Router ID?",
        exhibit:
"Segment came up earlier with R2 already elected DR.\n" +
"R2: priority 1, Router ID 10.0.0.2 (current DR)\n" +
"R3: priority 1, Router ID 10.0.0.30 (added later)",
        options: [
          "OSPF DR election is non-preemptive; R2 remains DR even though R3 has a higher Router ID",
          "R3's priority is too low",
          "R3 is in a different area",
          "R3 must be the ABR to be DR"
        ],
        answer: 0, multi: false,
        explanation: "OSPF does not preempt an existing DR. Since R2 was already DR when R3 joined, R2 stays DR even though R3's Router ID is higher; R3 would only become DR after a re-election (e.g., R2 fails). Priorities are equal here." },
      { id: "X15", domain: "OSPF",
        text: "You configure 'area 0.0.0.5 nssa no-summaries default-lsa default-metric 10'. What behavior does this create for that area?",
        options: [
          "A totally stubby NSSA: no Type 3 summaries, a default route injected, but a local ASBR can still originate Type 7",
          "A standard area with externals",
          "A backbone area",
          "A stub area that blocks the local ASBR"
        ],
        answer: 0, multi: false,
        explanation: "'nssa no-summaries' with a default LSA creates a totally stubby NSSA: inter-area Type 3 summaries are suppressed and replaced by a default route, yet a local ASBR may still inject Type 7 externals — combining NSSA capability with maximal summarization." },
      { id: "X16", domain: "OSPF",
        text: "Referring to the exhibit, which metric will R1 use to reach 172.16.8.0/24?",
        exhibit:
"R1 cost to ABR = 5\n" +
"ABR advertises 172.16.8.0/24 as a Type 3 summary with metric 20",
        options: [
          "25 (R1's cost to the ABR plus the advertised summary metric)",
          "20 (only the advertised metric)",
          "5 (only R1's cost to the ABR)",
          "0 (inter-area routes have no metric)"
        ],
        answer: 0, multi: false,
        explanation: "For an inter-area (Type 3) route the total cost is the advertising ABR's summary metric plus the receiving router's cost to reach that ABR: 20 + 5 = 25." },
      { id: "X17", domain: "OSPF",
        text: "An interface is configured 'passive' under OSPF. Which two statements are true? (Choose two.)",
        options: [
          "Its subnet is advertised into OSPF",
          "It neither sends nor processes Hellos, so no adjacency forms on it",
          "It becomes the DR automatically",
          "It is removed from the routing table"
        ],
        answer: [0, 1], multi: true,
        explanation: "A passive OSPF interface still advertises its subnet into the LSDB but does not send/accept Hellos, so no adjacency forms there — ideal for stub LANs and loopbacks. It does not become DR or leave the routing table." },
      { id: "X18", domain: "OSPF",
        text: "Which OSPF troubleshooting step best confirms whether the local router is even sending Hellos out an interface?",
        options: [
          "Enable OSPF traceoptions (hello flag) and inspect the log for 'OSPF sent Hello ...'",
          "Run show route protocol ospf",
          "Clear the ARP table",
          "Check the MAC table"
        ],
        answer: 0, multi: false,
        explanation: "OSPF traceoptions with the hello flag logs 'OSPF sent/rcvd Hello' events, directly showing whether Hellos are transmitted/received on the interface. Route/ARP/MAC checks do not reveal Hello behavior." },
      { id: "X19", domain: "OSPF",
        text: "Referring to the exhibit, what does the presence of a Type 4 (ASBR-summary) LSA tell R1?",
        exhibit:
"R1 is in area 1. It receives:\n" +
"  Type 5 external for 10.100.0.0/16 (originated by ASBR 10.0.0.9 in area 2)\n" +
"  Type 4 ASBR-summary for 10.0.0.9 from the ABR",
        options: [
          "How to reach the ASBR (10.0.0.9) in another area so the external route can be resolved",
          "That 10.100.0.0/16 is a stub route",
          "That R1 is the ASBR",
          "That the area is an NSSA"
        ],
        answer: 0, multi: false,
        explanation: "A Type 4 ASBR-summary LSA, originated by the ABR, advertises reachability to an ASBR located in another area. R1 needs it to resolve the forwarding path for the Type 5 external whose advertising ASBR (10.0.0.9) is outside R1's area." },

      // ================= LAYER 2 SWITCHING / VLANs (7) =================
      { id: "X20", domain: "L2",
        text: "Referring to the exhibit, hosts in VLAN 20 cannot reach VLAN 30 hosts on the same switch. What is missing?",
        exhibit:
"vlans {\n" +
"  v20 { vlan-id 20; }              # no l3-interface\n" +
"  v30 { vlan-id 30; l3-interface irb.30; }\n" +
"}\n" +
"interfaces irb unit 30 family inet address 10.30.0.1/24;",
        options: [
          "VLAN 20 has no IRB/L3 interface, so there is no gateway to route between VLAN 20 and 30",
          "Storm control is dropping the traffic",
          "The trunk native VLAN is wrong",
          "MACsec must be enabled"
        ],
        answer: 0, multi: false,
        explanation: "Inter-VLAN routing needs a Layer 3 gateway (IRB) for BOTH VLANs. VLAN 30 has irb.30 but VLAN 20 has no l3-interface, so hosts in VLAN 20 have no gateway and cannot be routed to VLAN 30. Add an IRB for VLAN 20." },
      { id: "X21", domain: "L2",
        text: "A trunk between two switches works for tagged VLANs but untagged management traffic fails. The native VLAN differs on each side (VLAN 1 vs VLAN 99). What is the consequence?",
        options: [
          "Untagged frames are placed into different VLANs on each switch, so they do not communicate (and can leak between VLANs)",
          "All tagged VLANs stop working",
          "The trunk goes down",
          "STP disables the link"
        ],
        answer: 0, multi: false,
        explanation: "A native-VLAN mismatch means untagged frames entering one side as VLAN 1 are interpreted as VLAN 99 on the other, breaking untagged communication and risking VLAN leaking. Tagged VLANs are unaffected and the link stays up, which makes this a subtle bug." },
      { id: "X22", domain: "L2",
        text: "Which describes the correct handling when an ELS switch receives a broadcast frame in VLAN 10?",
        options: [
          "It floods the frame out every VLAN-10 port except the ingress port",
          "It sends it only to the trunk",
          "It routes it via the IRB",
          "It drops it unless a static MAC exists"
        ],
        answer: 0, multi: false,
        explanation: "Broadcast (and unknown-unicast/multicast) frames are flooded to all ports in the VLAN except the port they arrived on. Routing via IRB only applies to traffic destined to the gateway, not L2 broadcasts." },
      { id: "X23", domain: "L2",
        text: "Referring to the exhibit, what will 'set vlans v50 vlan-id 50' plus 'set interfaces ge-0/0/8 unit 0 family ethernet-switching interface-mode access vlan members 50' accomplish?",
        exhibit:
"[edit] committing...",
        options: [
          "It places ge-0/0/8 as an untagged access port in VLAN 50",
          "It makes ge-0/0/8 a trunk carrying VLAN 50",
          "It creates an IRB for VLAN 50",
          "It enables MVRP on ge-0/0/8"
        ],
        answer: 0, multi: false,
        explanation: "interface-mode access with a single VLAN member makes ge-0/0/8 an untagged access port in VLAN 50. Trunk mode, IRB creation, and MVRP each require different, additional configuration." },
      { id: "X24", domain: "L2",
        text: "You need two switches to negotiate which VLANs are active across their trunk automatically, pruning unused ones. Which protocol provides this, and what is a caution?",
        options: [
          "MVRP; scope which trunks participate because dynamic changes alter the active L2 topology",
          "LLDP; it may disable PoE",
          "LACP; it bundles the links",
          "STP; it blocks the trunk"
        ],
        answer: 0, multi: false,
        explanation: "MVRP dynamically registers/prunes active VLANs across participating trunks. Because it changes which VLANs traverse trunks automatically, you should control which interfaces participate to avoid unintended topology changes. The others serve unrelated roles." },
      { id: "X25", domain: "L2",
        text: "An IRB interface is configured with an IP but hosts using it as a gateway have no connectivity. 'show interfaces irb' shows the IRB is down. Which condition most commonly causes an IRB to be down?",
        options: [
          "No active member interface exists in the associated VLAN, so the IRB has no operational L2 to bind to",
          "The IRB has too high an MTU",
          "The IRB needs MACsec",
          "The IRB must be a trunk"
        ],
        answer: 0, multi: false,
        explanation: "An IRB comes up only when its associated VLAN has at least one active member interface. If all member ports are down (or the VLAN has none), the IRB stays down and cannot serve as a gateway. It is not an MTU/MACsec/trunk issue." },
      { id: "X26", domain: "L2",
        text: "Which two frame types does a Junos switch flood within a VLAN when appropriate? (Choose two.)",
        options: [
          "Broadcast frames",
          "Unknown-unicast frames",
          "Known-unicast frames to a learned MAC",
          "Frames destined to the IRB's own MAC"
        ],
        answer: [0, 1], multi: true,
        explanation: "Broadcast and unknown-unicast (and multicast) frames are flooded within the VLAN. Known-unicast frames are sent only to the learned egress port, and frames to the IRB's MAC are handed to the L3 process for routing, not flooded." },

      // ================= LAYER 2 SECURITY + FILTERS (7) =================
      { id: "X27", domain: "L2",
        text: "Referring to the exhibit, MAC limiting is set to 2 with the default action. A third MAC appears on ge-0/0/11. What happens?",
        exhibit:
"ethernet-switching-options secure-access-port {\n" +
"  interface ge-0/0/11 { mac-limit 2; }\n" +
"}\n" +
"Learned so far: MAC-A, MAC-B; now MAC-C appears.",
        options: [
          "The switch stops learning new MACs on the port and drops traffic to/from MAC-C, leaving the port up",
          "The switch shuts the port down for five minutes",
          "The switch floods MAC-C's traffic out all ports",
          "The switch reboots the FPC"
        ],
        answer: 0, multi: false,
        explanation: "The default MAC-limit action stops learning additional MACs and drops packets to/from the offending MAC (MAC-C) while keeping the port operational. Shutting the port is a non-default action you must configure explicitly." },
      { id: "X28", domain: "L2",
        text: "Which sequence correctly reflects how DHCP snooping, DAI, and IP source guard depend on one another?",
        options: [
          "DHCP snooping builds the binding table; DAI and IP source guard both consult it to validate ARP and data traffic",
          "DAI builds the table; DHCP snooping consults it",
          "IP source guard builds the table; DHCP snooping consults it",
          "They are independent and share no data"
        ],
        answer: 0, multi: false,
        explanation: "DHCP snooping is the foundation: it observes DHCP exchanges and builds the IP-MAC-port binding table. DAI uses those bindings to validate ARP, and IP source guard uses them to validate data-plane source addresses." },
      { id: "X29", domain: "L2",
        text: "Referring to the exhibit, a client on an untrusted port sends a DHCP OFFER. What does DHCP snooping do?",
        exhibit:
"ge-0/0/15: untrusted (client access port)\n" +
"Received on ge-0/0/15: DHCPOFFER (server-to-client message)",
        options: [
          "It drops the OFFER, because server-sourced messages are not allowed on an untrusted port (rogue-server protection)",
          "It forwards the OFFER and creates a binding",
          "It trusts the port automatically",
          "It floods the OFFER to all ports"
        ],
        answer: 0, multi: false,
        explanation: "Server-to-client messages (OFFER/ACK) are only permitted on trusted ports. An OFFER arriving on an untrusted client port indicates a rogue DHCP server and is dropped — the core purpose of DHCP snooping." },
      { id: "X30", domain: "POLICY",
        text: "Referring to the exhibit, which term ultimately handles an ARP frame (EtherType 0x0806) from an unlisted source MAC?",
        exhibit:
"filter L2SEC {\n" +
"  term drop-bad-mac { from { source-mac-address 00:66:66:66:66:66/48; } then discard; }\n" +
"  term allow-arp    { from { ether-type arp; } then accept; }\n" +
"  term default      { then discard; }\n" +
"}",
        options: [
          "term allow-arp accepts it (its source MAC is not the blocked one, and it matches ether-type arp)",
          "term drop-bad-mac discards it",
          "term default discards it",
          "It is both accepted and discarded"
        ],
        answer: 0, multi: false,
        explanation: "The frame's source MAC is not 00:66:66:66:66:66, so term drop-bad-mac does not match. The next term matches ether-type arp and accepts, stopping evaluation before the default discard. Top-down, first terminating match wins." },
      { id: "X31", domain: "POLICY",
        text: "Which statement about where Layer 2 (ethernet-switching) firewall filters can be applied is correct?",
        options: [
          "They can be applied at the port level or the VLAN level, affecting different scopes of switched traffic",
          "They can only be applied to lo0",
          "They can only be applied to routed (family inet) interfaces",
          "They can only be applied to aggregated Ethernet"
        ],
        answer: 0, multi: false,
        explanation: "Ethernet-switching filters apply at a port (interface) scope or a VLAN scope, letting you filter specific ports or all traffic in a VLAN. lo0 is for control-plane (routed) protection, not L2 switched traffic." },
      { id: "X32", domain: "POLICY",
        text: "A storm-control profile uses a bandwidth percentage without an action. During a broadcast storm exceeding the level, what is the behavior?",
        options: [
          "The excess BUM traffic is dropped, but the interface remains up",
          "The interface is disabled",
          "The VLAN is deleted",
          "STP recalculates the root"
        ],
        answer: 0, multi: false,
        explanation: "Without an explicit shutdown action, storm control simply drops the BUM traffic above the configured level while keeping the port up. Only a configured 'shutdown' action would disable the interface." },
      { id: "X33", domain: "POLICY",
        text: "You must rate-limit ARP to the Routing Engine to mitigate an ARP flood without dropping legitimate control traffic. Which approach is appropriate?",
        options: [
          "An lo0 firewall filter term matching ARP with a policer that limits the rate, then accept",
          "Disable ARP globally",
          "Apply storm control on lo0",
          "Increase the MAC aging timer"
        ],
        answer: 0, multi: false,
        explanation: "A control-plane (lo0) filter term matching ARP with a 'then policer' action rate-limits ARP toward the RE while still accepting conforming traffic — protecting the control plane without a blanket drop. Storm control is an L2 data-plane feature, not for lo0." },

      // ================= BGP (8) =================
      { id: "X34", domain: "BGP",
        text: "Referring to the exhibit, which path becomes active for 10.10.0.0/16?",
        exhibit:
"Path  NH reachable  Local-Pref  AS-Path        Origin  MED  Peer-type\n" +
"A     yes           120         65001 65002    IGP     0    EBGP\n" +
"B     yes           120         65005          IGP     0    EBGP\n" +
"C     yes           150         65001 65002    Incompl 0    IBGP",
        options: [
          "Path C, because it has the highest local preference",
          "Path B, because it has the shortest AS-path",
          "Path A, because it is EBGP",
          "Path B, because its origin is IGP"
        ],
        answer: 0, multi: false,
        explanation: "Local preference is compared first (after next-hop validity). Path C's local-pref 150 beats A and B (120), so C wins immediately — AS-path length, origin, and EBGP-over-IBGP are later tiebreakers that never come into play here." },
      { id: "X35", domain: "BGP",
        text: "Referring to the exhibit, why is the route to 198.51.100.0/24 not being advertised to the EBGP customer, despite being active?",
        exhibit:
"Active route: 198.51.100.0/24 via IBGP\n" +
"Export policy to customer: term A { from protocol bgp; then accept; } (aggregate/static not matched)\n" +
"But group has: export [ REJECT-PRIVATE accept-bgp ]  where REJECT-PRIVATE matches 198.51.100.0/24 then reject",
        options: [
          "An earlier policy term (REJECT-PRIVATE) matches and rejects the prefix before the accept term runs",
          "IBGP routes are never advertised to EBGP peers",
          "The route needs a community",
          "The customer must use multihop"
        ],
        answer: 0, multi: false,
        explanation: "Export policies are evaluated in order; REJECT-PRIVATE matches 198.51.100.0/24 and rejects it (a terminating action) before the later accept term is reached. IBGP-learned routes CAN be advertised to EBGP peers, so that is not the cause." },
      { id: "X36", domain: "BGP",
        text: "Which two conditions must be true for Junos to compare the MED between two BGP paths by default? (Choose two.)",
        options: [
          "The paths are received from the same neighboring AS",
          "Both paths have survived the earlier local-pref and AS-path comparisons (tie so far)",
          "The paths have different local preferences",
          "One path is IBGP and the other EBGP"
        ],
        answer: [0, 1], multi: true,
        explanation: "By default MED is only compared among paths from the same neighboring AS, and only if the earlier criteria (local-pref, AS-path length, origin) have not already decided the winner. Differing local-pref would end selection before MED; peer type is a later tiebreaker." },
      { id: "X37", domain: "BGP",
        text: "You need routes learned from a customer to be advertised to your upstream transit providers but NOT to your settlement-free peers. Which mechanism scales best?",
        options: [
          "Tag routes with communities and use export policies per neighbor group to match those communities",
          "Manually list every prefix per neighbor",
          "Use EBGP multihop",
          "Raise the local preference"
        ],
        answer: 0, multi: false,
        explanation: "Community tagging plus per-neighbor-group export policies is the scalable standard: mark customer routes with a community, then advertise to transit but filter them from peers by matching the community. Manual per-prefix lists do not scale; multihop/local-pref are unrelated." },
      { id: "X38", domain: "BGP",
        text: "Referring to the exhibit, a prefix is received but shows as 'Accepted' yet 'inactive'. Both next hop and validity are fine, and a better BGP path exists. What does 'inactive' indicate here?",
        exhibit:
"user@r> show route 203.0.113.0/24 detail\n" +
"  203.0.113.0/24 (2 entries)\n" +
"    *BGP ... (active)\n" +
"     BGP ... Accepted, Inactive  (this path)",
        options: [
          "The path passed import policy but lost the best-path selection to another BGP path",
          "The path was rejected by policy",
          "The next hop is unreachable",
          "The prefix is a martian"
        ],
        answer: 0, multi: false,
        explanation: "'Accepted, Inactive' means the route was permitted by import policy but was not chosen as the active best path (another path won selection). It is different from a hidden/unusable route (bad next hop) or a rejected route (policy)." },
      { id: "X39", domain: "BGP",
        text: "Which statement about EBGP versus IBGP administrative preference in Junos is correct by default?",
        options: [
          "Both EBGP and IBGP routes have a default BGP preference of 170, so neither is preferred purely by protocol preference",
          "EBGP has preference 20 and IBGP 200",
          "IBGP is always preferred over EBGP",
          "EBGP routes are never installed"
        ],
        answer: 0, multi: false,
        explanation: "In Junos, BGP routes (both EBGP and IBGP) have a default route preference of 170. EBGP-over-IBGP preference is applied as a step in the BGP best-path algorithm, not via a different route-preference value like some other vendors use." },
      { id: "X40", domain: "BGP",
        text: "Referring to the exhibit, the operator wants r1 to advertise its IBGP-learned routes to r3 without changing the next hop, but r3 cannot reach the original next hop. Which fix is most direct?",
        exhibit:
"r1 (IBGP) -> r3 (EBGP customer)\n" +
"IBGP route next hop = 10.0.0.9 (inside r1's AS, not reachable by r3)",
        options: [
          "Apply 'next-hop self' on r1 for the session to r3",
          "Enable damping on r3",
          "Add a route reflector",
          "Prepend the AS toward r3"
        ],
        answer: 0, multi: false,
        explanation: "When advertising to an EBGP peer, r1 already sets next-hop self by default for EBGP; the scenario's problem is the unchanged internal next hop, so explicitly ensuring 'next-hop self' toward r3 makes r3 use r1 as the next hop it can reach. Damping/RR/prepending do not fix next-hop reachability." },
      { id: "X41", domain: "BGP",
        text: "A newly configured EBGP session is Established, but no routes are received. The peer confirms it is advertising prefixes. Which local cause is most likely?",
        options: [
          "An import policy is rejecting the received routes",
          "The session needs multihop",
          "The AS numbers match (making it IBGP)",
          "The hold timer is too high"
        ],
        answer: 0, multi: false,
        explanation: "With the session Established and the peer advertising, an import policy rejecting the routes is the most likely local reason none are accepted/visible. Multihop/hold-timer issues would prevent the session from establishing; matching AS would make it IBGP (and typically be intended or flagged)." },

      // ================= IS-IS (6) =================
      { id: "X42", domain: "ISIS",
        text: "Referring to the exhibit, R1 (L1-only) is not learning routes to a remote area. Why, and what is the standard fix?",
        exhibit:
"R1: level 1 only, area 49.0001\n" +
"Remote prefixes live in area 49.0002 (reached via L2 backbone)\n" +
"R1 has no default route to the L1/L2 router.",
        options: [
          "L1-only routers rely on the nearest L1/L2 router (attached bit) for a default route to other areas; ensure an L1/L2 router sets it",
          "R1 must run OSPF",
          "R1 needs wide metrics disabled",
          "R1's system ID must match the remote router"
        ],
        answer: 0, multi: false,
        explanation: "An L1-only router reaches other areas via the nearest L1/L2 router, which sets the attached (ATT) bit so L1 routers install a default route toward it. If no L1/L2 router advertises the attached bit / default, R1 cannot reach other areas. It is not an OSPF/metric/system-ID matter." },
      { id: "X43", domain: "ISIS",
        text: "Which statement about IS-IS metrics and traffic engineering is correct?",
        options: [
          "Wide metrics (extended TLVs) are required for per-link metrics above 63 and for TE extensions",
          "Narrow metrics support values up to 1023",
          "IS-IS derives metrics from bandwidth by default",
          "Metrics cannot be changed once set"
        ],
        answer: 0, multi: false,
        explanation: "Narrow metrics cap a link at 63 (6-bit field). Wide metrics use extended TLVs supporting much larger values and are prerequisites for IS-IS TE. Junos uses a fixed default metric of 10 (not bandwidth-derived), and metrics are configurable." },
      { id: "X44", domain: "ISIS",
        text: "Referring to the exhibit, what is the function of the periodic CSNP that R2 sends on the LAN?",
        exhibit:
"R2 is the DIS on the LAN.\n" +
"Every ~10s: R2 sends CSNP listing all LSPs in the database.",
        options: [
          "It lets other routers detect and request any missing or outdated LSPs, keeping databases synchronized",
          "It elects the DIS",
          "It forms adjacencies",
          "It withdraws the pseudonode"
        ],
        answer: 0, multi: false,
        explanation: "The DIS periodically multicasts CSNPs (a complete list of LSP headers) on the LAN; routers compare them to their own databases and use PSNPs to request anything missing/stale, maintaining synchronization. IIH forms adjacencies and drives DIS election." },
      { id: "X45", domain: "ISIS",
        text: "You want a backbone link to carry only Level 2 and never attempt Level 1 adjacencies. Which interface configuration achieves this?",
        options: [
          "Set the interface to level 1 disable (leaving it Level 2)",
          "Set the interface passive",
          "Set a metric of 63",
          "Enable the overload bit"
        ],
        answer: 0, multi: false,
        explanation: "Disabling Level 1 on the interface restricts it to Level 2 operation, so only L2 adjacencies form — appropriate for pure backbone links. Passive advertises but forms no adjacency at all; metric and overload bit are unrelated to level restriction." },
      { id: "X46", domain: "ISIS",
        text: "Two routers form an adjacency but one shows the other only at Level 2 when both should be L1/L2 in the same area. Which mismatch causes L1 not to form while L2 does?",
        options: [
          "Different area addresses (L2 ignores area, L1 requires the same area)",
          "Different system IDs",
          "Different hostnames",
          "Different loopback masks"
        ],
        answer: 0, multi: false,
        explanation: "If the area addresses differ, the Level 1 adjacency cannot form (L1 requires a shared area) while the Level 2 adjacency still forms (L2 is area-independent). System IDs must be unique; hostnames/loopback masks do not gate adjacency levels." },
      { id: "X47", domain: "ISIS",
        text: "Which command would you use first to confirm whether an IS-IS adjacency is Up and at which level?",
        options: [
          "show isis adjacency",
          "show isis database",
          "show route protocol isis",
          "show isis spf log"
        ],
        answer: 0, multi: false,
        explanation: "'show isis adjacency' lists neighbors with their Up/Down state and level(s) — the first check for adjacency problems. The database, route, and SPF-log commands help after you know the adjacency state." },

      // ================= PROTOCOL-INDEPENDENT ROUTING (5) =================
      { id: "X48", domain: "PIR",
        text: "Referring to the exhibit, which next hop does the router use for 10.2.3.4, and why?",
        exhibit:
"user@r> show route 10.2.3.4\n" +
"10.0.0.0/8    *[Static/5]  via ge-0/0/1.0\n" +
"10.2.0.0/16   *[BGP/170]   via ge-0/0/2.0\n" +
"0.0.0.0/0     *[Static/5]  via ge-0/0/9.0",
        options: [
          "ge-0/0/2.0, because 10.2.0.0/16 is the longest matching prefix for 10.2.3.4",
          "ge-0/0/1.0, because static preference 5 beats BGP 170",
          "ge-0/0/9.0, via the default route",
          "It load-balances across all three"
        ],
        answer: 0, multi: false,
        explanation: "Forwarding chooses the longest matching prefix first: 10.2.0.0/16 matches 10.2.3.4 more specifically than 10.0.0.0/8 or the default, so the BGP route is used despite its higher preference. Preference only breaks ties between identical prefixes." },
      { id: "X49", domain: "PIR",
        text: "A generated route for 172.20.0.0/16 is active. What next hop does it use, and how does this differ from an aggregate?",
        options: [
          "It inherits the next hop of its primary contributing route (a real forwarding path), unlike an aggregate that defaults to reject",
          "It always uses discard",
          "It uses the default route's next hop",
          "It has no next hop and is never installed"
        ],
        answer: 0, multi: false,
        explanation: "A generated route takes the next hop of its primary (preferred) contributing route, giving it a usable forwarding path — unlike an aggregate route, whose default action is reject. Both require a contributing more-specific route to activate." },
      { id: "X50", domain: "PIR",
        text: "Referring to the exhibit, what is the effect of this RIB-group configuration on OSPF routes?",
        exhibit:
"routing-options rib-groups OSPF-LEAK {\n" +
"  import-rib [ inet.0 CUST.inet.0 ];\n" +
"}\n" +
"protocols ospf rib-group OSPF-LEAK;",
        options: [
          "OSPF installs its routes into both inet.0 and the CUST.inet.0 table (route leaking)",
          "It disables OSPF in inet.0",
          "It converts OSPF to BGP",
          "It creates an aggregate route"
        ],
        answer: 0, multi: false,
        explanation: "A rib-group with import-rib listing multiple tables makes the protocol install its routes into all of them. Here OSPF routes populate both inet.0 and CUST.inet.0, leaking them into the customer instance's table. The primary table stays inet.0." },
      { id: "X51", domain: "PIR",
        text: "You want a summary advertised only while a specific component prefix is present, and the summary must forward via a real path (not reject). Which route type do you configure?",
        options: [
          "A generated route",
          "An aggregate route",
          "A martian entry",
          "A static discard route"
        ],
        answer: 0, multi: false,
        explanation: "A generated route activates only with a contributing route AND inherits that contributor's real next hop — meeting 'advertise only with a component present' and 'forward via a real path'. An aggregate would use a reject next hop by default." },
      { id: "X52", domain: "PIR",
        text: "Referring to the exhibit, filter-based forwarding is configured but matched traffic is dropped. What is the missing piece?",
        exhibit:
"routing-instances ALT { instance-type forwarding; routing-options { } }   # empty table\n" +
"firewall filter FBF term t1 { from source-address 192.168.7.0/24; then routing-instance ALT; }\n" +
"(no rib-group leaking interface routes into ALT.inet.0)",
        options: [
          "A rib-group is needed to populate ALT.inet.0 with the interface/next-hop routes so the alternate path resolves",
          "MACsec must be enabled",
          "The filter must be applied to lo0",
          "An aggregate route is required"
        ],
        answer: 0, multi: false,
        explanation: "The forwarding instance's table (ALT.inet.0) is empty, so matched traffic has no resolvable next hop and is dropped. A rib-group must import the relevant interface/next-hop routes into ALT.inet.0 — the most common FBF oversight." },

      // ================= HIGH AVAILABILITY / TUNNELS (8) =================
      { id: "X53", domain: "HA",
        text: "Referring to the exhibit, which HA feature is enabled, and what does it guarantee during an RE switchover?",
        exhibit:
"user@r> show system switchover\n" +
"  Graceful switchover: On\n" +
"  Nonstop-routing:     On\n" +
"  Nonstop-bridging:    On",
        options: [
          "GRES + NSR + NSB, so forwarding, routing-protocol state, and Layer 2 state are all preserved across a switchover",
          "Only forwarding is preserved",
          "Only Layer 2 is preserved",
          "Nothing is preserved without VRRP"
        ],
        answer: 0, multi: false,
        explanation: "With graceful switchover (GRES), nonstop-routing (NSR), and nonstop-bridging (NSB) all on, the backup RE preserves kernel/forwarding state, Layer 3 routing-protocol state, and Layer 2 state — the most complete non-stop configuration." },
      { id: "X54", domain: "HA",
        text: "Which statement about how a Virtual Chassis selects its master is correct?",
        options: [
          "Highest configured mastership priority wins; if priorities tie, tiebreakers (e.g., existing master, uptime, lowest member ID) apply, and a running master is not preempted by default",
          "Lowest MAC always wins immediately, preempting any master",
          "The last switch added always becomes master",
          "Mastership is random each boot"
        ],
        answer: 0, multi: false,
        explanation: "VC mastership favors the highest configured priority, with deterministic tiebreakers when priorities are equal, and a running master is not preempted by default when a higher-priority member joins later — avoiding disruptive re-elections." },
      { id: "X55", domain: "HA",
        text: "You need active/standby uplink redundancy on an access switch with sub-second failover and no spanning tree. The uplinks go to two different distribution switches. Which feature fits?",
        options: [
          "Redundant trunk group (RTG)",
          "LAG across the two distribution switches",
          "VRRP on the access switch",
          "MSTP with two instances"
        ],
        answer: 0, multi: false,
        explanation: "An RTG provides active/standby uplinks with fast failover and no spanning tree — ideal when uplinks go to two different distribution switches. A standard LAG would need both ends on the same peer (or MC-LAG), VRRP is a gateway feature, and MSTP is spanning tree." },
      { id: "X56", domain: "HA",
        text: "Referring to the exhibit, BFD is configured on an OSPF adjacency. What detection time results, and what happens when it fires?",
        exhibit:
"protocols ospf area 0 interface ge-0/0/0.0 {\n" +
"  bfd-liveness-detection { minimum-interval 250; multiplier 3; }\n" +
"}",
        options: [
          "About 750 ms; when BFD declares the neighbor down, OSPF tears down the adjacency and reconverges immediately",
          "About 250 ms; OSPF ignores BFD",
          "About 3 s; the interface is shut down",
          "About 75 ms; BGP is affected instead"
        ],
        answer: 0, multi: false,
        explanation: "Detection ≈ interval × multiplier = 250 ms × 3 = 750 ms. When BFD signals the neighbor is down, OSPF immediately tears down the adjacency and reconverges — far faster than waiting for the 40 s dead interval." },
      { id: "X57", domain: "HA",
        text: "Which two are accurate about LAG (aggregated Ethernet) with LACP? (Choose two.)",
        options: [
          "All properly negotiated member links forward simultaneously, increasing bandwidth",
          "LACP keeps mismatched or non-responding members out of the active bundle",
          "Only one member forwards while the others stand by",
          "A LAG requires spanning tree to prevent a loop over the bundle"
        ],
        answer: [0, 1], multi: true,
        explanation: "A LAG uses all correctly negotiated members at once for bandwidth/redundancy, and LACP detects and excludes members that mismatch or do not respond. Active/standby describes RTG, not LAG, and the bundle is one logical link so no STP is needed to loop-protect it." },
      { id: "X58", domain: "HA",
        text: "You want traffic to traverse a GRE tunnel between two enterprise sites over the Internet. Which two are required? (Choose two.)",
        options: [
          "A route at each endpoint that sends the site-to-site traffic into the gr- interface",
          "Reachability between the tunnel's outer source and destination addresses across the Internet",
          "That every ISP router in the path has a route to the inner private subnets",
          "IPsec, because GRE cannot carry traffic without it"
        ],
        answer: [0, 1], multi: true,
        explanation: "The tunnel works when each end routes the intended traffic into the gr- interface and the underlay can reach the tunnel's outer endpoint addresses. Intermediate ISP routers only forward the outer packet and need not know the inner subnets; GRE carries traffic without IPsec (IPsec would only add encryption)." },
      { id: "X59", domain: "HA",
        text: "Referring to the exhibit, a GRE tunnel is 'up' but pings across it with the DF bit set and a large size fail while small pings succeed. What is the fix?",
        exhibit:
"ping 10.20.20.1 size 1500 do-not-fragment  -> fails\n" +
"ping 10.20.20.1 size 500                    -> succeeds\n" +
"Tunnel: gr-0/0/0 over an Internet path",
        options: [
          "Lower the tunnel MTU / clamp TCP MSS (or allow PMTUD) to account for GRE encapsulation overhead",
          "Enable MACsec on the tunnel",
          "Move the tunnel into a new VLAN",
          "Disable the IGP on the tunnel"
        ],
        answer: 0, multi: false,
        explanation: "GRE overhead lowers the effective MTU, so large DF packets exceed it and are dropped while small ones pass. Lowering the tunnel MTU, clamping TCP MSS, or allowing PMTUD (ICMP 'fragmentation needed') resolves it. It is not a VLAN/MACsec/IGP issue." },
      { id: "X60", domain: "HA",
        text: "Which statement correctly compares graceful restart with NSR for surviving a control-plane event?",
        options: [
          "Graceful restart depends on cooperating helper neighbors to keep forwarding; NSR preserves protocol state internally on a dual-RE system with no neighbor involvement",
          "Graceful restart needs no neighbor help; NSR requires it",
          "Both require helper neighbors",
          "Both require only a single Routing Engine"
        ],
        answer: 0, multi: false,
        explanation: "Graceful restart is protocol-based and relies on neighbors acting as helpers while a router restarts its control plane, whereas NSR replicates protocol state to a backup RE internally, so neighbors never notice the switchover. NSR therefore needs dual REs and no neighbor cooperation." }
    ]
  };

  if (typeof ENT_CERT !== "undefined" && ENT_CERT && Array.isArray(ENT_CERT.exams)) {
    var idx = 0;
    for (var i = 0; i < ENT_CERT.exams.length; i++) { if (ENT_CERT.exams[i].id === "ENT-VOUCHER-2") { idx = i + 1; break; } }
    ENT_CERT.exams.splice(idx, 0, EXAM);
  }
  if (typeof module !== "undefined") { module.exports = { ENT_VOUCHER_EXAM_3: EXAM }; }
})();
