/*
 * JNCIS-ENT (JN0-352) — Full-length Mock Exam #3 (HARD, hint-free).
 * 60 questions, 90-minute fixed clock (timeLimitSec: 5400).
 *
 * Same design rules as Mock 2:
 *  - Neutral exhibits (no answer-revealing comments).
 *  - No parenthetical hints or "because ..." justifications in options; reasoning
 *    lives only in q.explanation (shown after submission).
 *  - Closely-related, plausible distractors so the answer cannot be found by
 *    category or by length. Exempt from the automatic length-padding in data.js.
 *
 * Weighting: STP 9, OSPF 10, L2 switching 7, L2 security/filters 7,
 * BGP 8, IS-IS 6, PIR 5, HA/tunnels 8 = 60. No repeats of any existing ENT question.
 */
(function () {
  var EXAM = {
    id: "ENT-VOUCHER-3",
    name: "★ Full Mock 3 — 60 Q / 90 min (Hard)",
    description: "Full-length, hint-free exam with tight, closely-related distractors and neutral exhibits. Exhibit interpretation and multi-step scenarios across the ENT blueprint. 60 questions, 90-minute clock.",
    timeLimitSec: 5400,
    questions: [
      // ================= SPANNING TREE (9) =================
      { id: "X1", domain: "STP",
        text: "Referring to the exhibit, an operator needs SW-CORE to be the VSTP root for VLAN 100 but SW-DIST is currently root. The bridge priorities are equal. Which change most reliably makes SW-CORE the root?",
        exhibit:
"VSTP VLAN 100:\n" +
"  SW-CORE  bridge priority 32768  MAC 00:10:00:00:00:aa\n" +
"  SW-DIST  bridge priority 32768  MAC 00:10:00:00:00:05",
        options: [
          "Lower SW-CORE's bridge priority for VLAN 100",
          "Increase SW-DIST's port cost toward SW-CORE",
          "Raise SW-CORE's bridge priority for VLAN 100",
          "Shorten SW-CORE's hello timer for VLAN 100"
        ],
        answer: 0, multi: false,
        explanation: "With equal priorities the lower MAC wins, so SW-DIST is root. Lowering SW-CORE's priority gives it the lowest bridge ID and guarantees the root role. Raising SW-CORE's priority does the opposite, and port cost or hello timers do not decide the root." },
      { id: "X2", domain: "STP",
        text: "How does RSTP BPDU generation differ from legacy 802.1D on a non-root bridge?",
        options: [
          "Each bridge originates its own BPDUs every hello interval",
          "Only the root bridge originates BPDUs for the topology",
          "BPDUs are sent solely in response to a topology change",
          "Non-root bridges relay the root's BPDUs unchanged"
        ],
        answer: 0, multi: false,
        explanation: "In RSTP every bridge originates its own BPDUs each hello interval, so a neighbor's silence is detected quickly. In 802.1D non-root bridges effectively relayed the root's BPDUs, which slowed failure detection." },
      { id: "X3", domain: "STP",
        text: "Referring to the exhibit, ge-0/0/7 is shown as blocking with a bpdu-inconsistent flag. What triggered this state?",
        exhibit:
"user@sw> show spanning-tree interface\n" +
"  Interface   Role   State  Flags\n" +
"  ge-0/0/7    ---    BLK    bpdu-inconsistent, edge",
        options: [
          "A BPDU arrived on a BPDU-protected edge port",
          "The port lost the root-port election to a peer",
          "The MAC table filled and the port was held down",
          "A superior BPDU triggered root guard on the port"
        ],
        answer: 0, multi: false,
        explanation: "A bpdu-inconsistent state on an edge port indicates BPDU protect fired because a BPDU was received on that edge port. It is distinct from root guard's root-inconsistent state, and it is unrelated to root-port election or MAC-table capacity." },
      { id: "X4", domain: "STP",
        text: "You must run a spanning-tree design that scales to 500 VLANs with only a few instances while still providing two forwarding topologies for load distribution. Which choice fits?",
        options: [
          "MSTP with the 500 VLANs mapped across two instances",
          "VSTP running one separate spanning-tree instance per VLAN",
          "RSTP operating as a single common instance for all VLANs",
          "STP with per-port path-cost tuning applied on every trunk"
        ],
        answer: 0, multi: false,
        explanation: "MSTP maps many VLANs into a few instances; using two MSTIs yields two loop-free topologies for load distribution and scales far better than 500 VSTP instances. Single-instance RSTP or STP cannot provide per-group topologies." },
      { id: "X5", domain: "STP",
        text: "A blocking alternate port transitions to forwarding after its neighbor stops sending BPDUs on a one-way fiber fault, creating a loop. Which feature prevents this specific scenario?",
        options: [
          "Loop protect",
          "Root guard",
          "BPDU protect",
          "BPDU block on edge"
        ],
        answer: 0, multi: false,
        explanation: "Loop protect keeps a non-designated port from moving to forwarding when expected BPDUs stop arriving, which is exactly the unidirectional-link case. Root guard reacts to superior BPDUs, and BPDU protect/block react to BPDUs received on edge ports." },
      { id: "X6", domain: "STP",
        text: "On the root bridge of an instance, what is the role and state of every active port, assuming no same-segment redundancy?",
        options: [
          "Designated and forwarding",
          "Root and forwarding",
          "Alternate and blocking",
          "Backup and blocking"
        ],
        answer: 0, multi: false,
        explanation: "All active ports on the root bridge are designated ports in the forwarding state; the root has no root port and, without same-segment redundancy, no alternate or backup ports." },
      { id: "X7", domain: "STP",
        text: "Which two are valid reasons to configure an interface as an RSTP edge port? (Choose two.)",
        options: [
          "It connects to an end host and should forward immediately",
          "Its link transitions should not generate topology changes",
          "It connects to another switch that exchanges BPDUs",
          "It should be forced to win the root-port role"
        ],
        answer: [0, 1], multi: true,
        explanation: "Edge ports are for host-facing links so they forward immediately and their transitions do not cause topology-change churn. They are not for switch-to-switch links that carry BPDUs, and edge status has nothing to do with root-port selection." },
      { id: "X8", domain: "STP",
        text: "During reconvergence, host ports briefly lose traffic even though they are edge ports. What best explains the loss?",
        options: [
          "MAC entries are flushed and relearned elsewhere in the topology",
          "Edge ports pass through listening and learning during the change",
          "Edge ports transition to blocking on every topology change",
          "Edge ports adopt the full 802.1D forward-delay timer"
        ],
        answer: 0, multi: false,
        explanation: "Edge ports keep forwarding through a change, so any brief loss comes from MAC flushing and relearning as the topology reconverges, not from the edge port changing state. Edge ports do not run listening/learning, block, or use the legacy delay." },
      { id: "X9", domain: "STP",
        text: "Immediately after a bridge accepts a superior BPDU on a new root port, what does the RSTP sync process do?",
        options: [
          "Blocks its non-edge designated ports until they renegotiate",
          "Forwards on all of its ports without delay",
          "Triggers a new root-bridge election for the instance",
          "Flushes and reloads the bridge configuration"
        ],
        answer: 0, multi: false,
        explanation: "The sync process temporarily blocks the bridge's other non-edge designated ports and re-runs proposal/agreement so they return to forwarding safely, preventing a transient loop during rapid convergence. It neither forwards blindly, re-elects the root, nor reloads config." },

      // ================= OSPF (10) =================
      { id: "X10", domain: "OSPF",
        text: "Referring to the exhibit, the neighbor never advances past Init on R1. What is the cause?",
        exhibit:
"user@r1> show ospf neighbor\n" +
"  Address    Interface    State  ID        Pri  Dead\n" +
"  10.0.0.2   ge-0/0/0.0   Init   10.0.0.2  128   38\n" +
"On R2, an input firewall filter on ge-0/0/0 discards protocol ospf.",
        options: [
          "R2 discards R1's Hellos, so the neighbor stays one-way",
          "The dead interval on R1 is set too short",
          "R1 and R2 have mismatched interface priorities",
          "R1 is configured in a stub area"
        ],
        answer: 0, multi: false,
        explanation: "Init means R1 hears R2 but is not yet listed in R2's Hello. R2's input filter drops R1's Hellos, so R2 never sees R1 and the adjacency stays one-way. Dead-interval, priority, and stub settings would not produce a one-way Init here." },
      { id: "X11", domain: "OSPF",
        text: "A local ASBR inside an NSSA redistributes static routes. Which LSA does it originate, and what does the ABR do with it?",
        options: [
          "Type 7, which the ABR translates to Type 5 for other areas",
          "Type 5, which the ABR floods into the backbone unchanged",
          "Type 3, which the ABR blocks at the area boundary",
          "Type 1, which the ABR summarizes into a Type 2"
        ],
        answer: 0, multi: false,
        explanation: "Inside an NSSA the ASBR originates Type 7 externals (Type 5 is not permitted there), and the ABR translates selected Type 7 LSAs into Type 5 for the rest of the domain. The other mappings misstate the LSA types involved." },
      { id: "X12", domain: "OSPF",
        text: "Referring to the exhibit, R1 has two equal-cost OSPF paths to 10.9.9.0/24 but forwards over only one. What is required to use both?",
        exhibit:
"user@r1> show route 10.9.9.0/24\n" +
"  10.9.9.0/24  *[OSPF/10] to 10.0.12.2 via ge-0/0/1.0\n" +
"                          to 10.0.13.2 via ge-0/0/2.0",
        options: [
          "A load-balancing policy exported to the forwarding table",
          "A second OSPF area configured to cover the two parallel links",
          "An aggregate route that summarizes the 10.9.9.0/24 destination",
          "A higher OSPF reference bandwidth applied on both of the links"
        ],
        answer: 0, multi: false,
        explanation: "OSPF placed both paths in the RIB, but Junos installs a single next hop unless a load-balancing policy is exported to the forwarding table. Areas, aggregates, and reference bandwidth do not enable multipath forwarding." },
      { id: "X13", domain: "OSPF",
        text: "Which statement about OSPF virtual links is correct?",
        options: [
          "They transit a standard non-backbone area to extend area 0",
          "They transit a stub area in order to extend the backbone area",
          "They join two separate autonomous systems at the domain edge",
          "They remove the requirement for a unique router identifier"
        ],
        answer: 0, multi: false,
        explanation: "A virtual link traverses a standard (transit) non-backbone area to logically extend the backbone; it cannot cross a stub/NSSA area, does not connect autonomous systems, and does not remove the router-ID requirement." },
      { id: "X14", domain: "OSPF",
        text: "Referring to the exhibit, R3 has the highest Router ID on the segment but is not the DR. Why?",
        exhibit:
"Segment history: R2 was already DR when R3 was later added.\n" +
"  R2  priority 1  Router ID 10.0.0.2   role DR\n" +
"  R3  priority 1  Router ID 10.0.0.30  role DROTHER",
        options: [
          "DR election is non-preemptive, so R2 keeps the role",
          "R3's interface priority is too low to be eligible",
          "R3 is attached in a different OSPF area",
          "R3 must be an ABR before it can be DR"
        ],
        answer: 0, multi: false,
        explanation: "OSPF does not preempt an existing DR, so R2 stays DR even though R3 has a higher Router ID; R3 could win only after a re-election. Priorities are equal, area membership matches, and being an ABR is not a DR requirement." },
      { id: "X15", domain: "OSPF",
        text: "An area is configured with 'nssa no-summaries' and a default LSA injected by the ABR. Which behavior results?",
        options: [
          "Summaries are replaced by a default, but a local ASBR may still originate Type 7",
          "All external routes are blocked and no ASBR is permitted anywhere in the area",
          "The area behaves as a normal area and carries Type 5 external LSAs throughout",
          "The area becomes the backbone and provides transit between the other areas"
        ],
        answer: 0, multi: false,
        explanation: "This is a totally stubby NSSA: Type 3 summaries are suppressed and replaced with a default route, while a local ASBR can still inject Type 7 externals. A plain stub blocks the ASBR, and it is neither a normal area nor the backbone." },
      { id: "X16", domain: "OSPF",
        text: "Referring to the exhibit, what total cost does R1 use to reach 172.16.8.0/24?",
        exhibit:
"R1 cost to the advertising ABR: 5\n" +
"ABR advertises 172.16.8.0/24 as a Type 3 summary with metric 20",
        options: [
          "25",
          "20",
          "5",
          "15"
        ],
        answer: 0, multi: false,
        explanation: "An inter-area route's cost is the ABR's advertised summary metric plus the receiver's cost to that ABR: 20 + 5 = 25. Using 20 or 5 alone ignores one component, and 15 is unrelated." },
      { id: "X17", domain: "OSPF",
        text: "Which two statements are true for an interface configured as passive under OSPF? (Choose two.)",
        options: [
          "Its subnet is advertised into the OSPF database",
          "It neither sends nor accepts Hellos, so no adjacency forms",
          "It is automatically elected as the DR for its segment",
          "It is withdrawn from the router's routing table"
        ],
        answer: [0, 1], multi: true,
        explanation: "A passive interface still advertises its subnet into OSPF but exchanges no Hellos, so no adjacency forms on it. It is not elected DR and it remains in the routing table." },
      { id: "X18", domain: "OSPF",
        text: "Which action best confirms whether the local router is transmitting Hellos out a specific interface?",
        options: [
          "Enable OSPF traceoptions with the hello flag and read the log",
          "Run 'show route protocol ospf' for the interface subnet",
          "Clear the ARP cache and re-check the neighbor",
          "Inspect the Ethernet switching table for the segment"
        ],
        answer: 0, multi: false,
        explanation: "OSPF traceoptions with the hello flag logs sent and received Hello events, directly showing Hello transmission on the interface. Route output, ARP clearing, and the MAC table do not reveal Hello behavior." },
      { id: "X19", domain: "OSPF",
        text: "Referring to the exhibit, what does the Type 4 ASBR-summary LSA provide to R1?",
        exhibit:
"R1 is in area 1 and receives:\n" +
"  Type 5 external for 10.100.0.0/16, advertising router 10.0.0.9 (in area 2)\n" +
"  Type 4 ASBR-summary for 10.0.0.9, originated by the ABR",
        options: [
          "Reachability to the ASBR located in another area",
          "The metric type of the external route",
          "A default route toward the backbone",
          "The forwarding address for the external prefix"
        ],
        answer: 0, multi: false,
        explanation: "The Type 4 LSA, originated by the ABR, advertises how to reach an ASBR that sits in another area, which R1 needs to resolve the Type 5 external's path. It does not carry the metric type, a default route, or the external's forwarding address." },

      // ================= LAYER 2 SWITCHING / VLANs (7) =================
      { id: "X20", domain: "L2",
        text: "Referring to the exhibit, VLAN 20 hosts cannot reach VLAN 30 hosts on the same switch. What is missing?",
        exhibit:
"vlans {\n" +
"  v20 { vlan-id 20; }\n" +
"  v30 { vlan-id 30; l3-interface irb.30; }\n" +
"}\n" +
"interfaces irb unit 30 family inet address 10.30.0.1/24;",
        options: [
          "A Layer 3 interface for VLAN 20",
          "A trunk link carrying both VLANs",
          "A matching native VLAN on the uplink",
          "A storm-control profile on VLAN 20"
        ],
        answer: 0, multi: false,
        explanation: "Inter-VLAN routing needs a gateway for both VLANs. VLAN 30 has irb.30 but VLAN 20 has no l3-interface, so VLAN 20 hosts have no gateway to reach VLAN 30. A trunk, native VLAN, or storm control does not provide the missing Layer 3 interface." },
      { id: "X21", domain: "L2",
        text: "A trunk between two switches carries tagged VLANs fine, but untagged management traffic fails; the native VLAN is 1 on one side and 99 on the other. What is the consequence?",
        options: [
          "Untagged frames land in different VLANs on each side",
          "All tagged VLANs also stop forwarding on the trunk",
          "The trunk interface transitions to a down state",
          "Spanning tree disables the trunk to break a loop"
        ],
        answer: 0, multi: false,
        explanation: "A native-VLAN mismatch means untagged frames entering as VLAN 1 on one side are read as VLAN 99 on the other, breaking untagged communication and risking VLAN leaking. Tagged VLANs still work and the link stays up, which makes it a subtle fault." },
      { id: "X22", domain: "L2",
        text: "How does an ELS switch handle a broadcast frame received in VLAN 10?",
        options: [
          "Floods it out every VLAN 10 port except the ingress port",
          "Forwards it only out the trunk ports of VLAN 10",
          "Sends it to the IRB for VLAN 10 to be routed",
          "Drops it unless a matching static entry exists"
        ],
        answer: 0, multi: false,
        explanation: "Broadcast, unknown-unicast, and multicast frames are flooded to all ports in the VLAN except the ingress port. They are not restricted to trunks, routed via the IRB, or dropped for lack of a static entry." },
      { id: "X23", domain: "L2",
        text: "Which result does 'interface-mode access' with a single VLAN member produce on a port?",
        options: [
          "An untagged access port in that VLAN",
          "A trunk carrying that one VLAN tagged",
          "A Layer 3 interface for that VLAN",
          "A port that registers VLANs dynamically"
        ],
        answer: 0, multi: false,
        explanation: "Access mode with one member makes the port an untagged access port in that VLAN. Trunk mode carries tagged VLANs, an IRB provides Layer 3, and dynamic registration requires MVRP." },
      { id: "X24", domain: "L2",
        text: "Two switches must negotiate which VLANs are active across their trunk and prune the rest automatically. Which protocol provides this?",
        options: [
          "MVRP",
          "LLDP",
          "LACP",
          "RSTP"
        ],
        answer: 0, multi: false,
        explanation: "MVRP dynamically registers and prunes active VLANs across participating trunks. LLDP is neighbor discovery, LACP aggregates links, and RSTP handles loop prevention, none of which prune VLAN membership." },
      { id: "X25", domain: "L2",
        text: "Referring to the exhibit, hosts using irb.20 as their gateway have no connectivity and the IRB is down. Which condition most commonly causes this?",
        exhibit:
"user@sw> show interfaces irb.20 terse\n" +
"  irb.20  up  down  inet 10.20.0.1/24\n" +
"VLAN v20 has no operational member interfaces.",
        options: [
          "The associated VLAN has no active member interface",
          "The IRB unit has an oversized MTU configured",
          "The IRB requires a trunk port to come up",
          "The IRB needs MACsec enabled to forward"
        ],
        answer: 0, multi: false,
        explanation: "An IRB comes up only when its VLAN has at least one active member interface. With all members down, the IRB stays down and cannot act as a gateway. It is not an MTU, trunk-requirement, or MACsec issue." },
      { id: "X26", domain: "L2",
        text: "Which two frame types does a Junos switch flood within a VLAN? (Choose two.)",
        options: [
          "Broadcast frames",
          "Unknown-unicast frames",
          "Known-unicast frames to a learned MAC",
          "Frames destined to the IRB's own MAC"
        ],
        answer: [0, 1], multi: true,
        explanation: "Broadcast and unknown-unicast (and multicast) frames are flooded within the VLAN. Known-unicast frames go only to the learned egress port, and frames to the IRB's MAC are handed to the routing process rather than flooded." },

      // ================= LAYER 2 SECURITY + FILTERS (7) =================
      { id: "X27", domain: "L2",
        text: "Referring to the exhibit, MAC limiting is set to 2 with the default action, and a third MAC now appears on ge-0/0/11. What happens?",
        exhibit:
"ethernet-switching-options secure-access-port {\n" +
"  interface ge-0/0/11 { mac-limit 2; }\n" +
"}\n" +
"Learned: MAC-A, MAC-B. New: MAC-C.",
        options: [
          "Learning stops and MAC-C's traffic is dropped while the port stays up",
          "The port is administratively disabled for a fixed recovery period",
          "MAC-C's traffic is flooded out of all other ports in the same VLAN",
          "The oldest learned entry is aged out to make room for the new MAC-C"
        ],
        answer: 0, multi: false,
        explanation: "The default MAC-limit action stops learning further MACs and drops traffic for the offending MAC while keeping the port operational. Disabling the port is a non-default action, and the switch neither floods the excess MAC nor evicts an existing entry." },
      { id: "X28", domain: "L2",
        text: "Which sequence correctly describes how DHCP snooping, DAI, and IP source guard depend on one another?",
        options: [
          "DHCP snooping builds the bindings; DAI and IP source guard both consult them",
          "DAI builds the bindings; DHCP snooping and IP source guard consult them",
          "IP source guard builds the bindings; DHCP snooping and DAI consult them",
          "Each feature builds and maintains its own independent bindings"
        ],
        answer: 0, multi: false,
        explanation: "DHCP snooping observes DHCP exchanges and builds the binding table; DAI uses it to validate ARP and IP source guard uses it to validate data-plane source addresses. The other orderings reverse the dependency." },
      { id: "X29", domain: "L2",
        text: "Referring to the exhibit, a client on an untrusted access port sends a DHCP OFFER. What does DHCP snooping do?",
        exhibit:
"ge-0/0/15: dhcp-security trust state = untrusted\n" +
"Received on ge-0/0/15: DHCPOFFER",
        options: [
          "Drops the OFFER as a server message on an untrusted port",
          "Forwards the OFFER and records a new snooping binding entry",
          "Marks the ingress port as trusted after the first valid OFFER",
          "Floods the OFFER out of all the other ports in the same VLAN"
        ],
        answer: 0, multi: false,
        explanation: "Server-to-client messages such as OFFER are permitted only on trusted ports; an OFFER on an untrusted client port signals a rogue server and is dropped. It is not forwarded, and the port is never auto-trusted." },
      { id: "X30", domain: "POLICY",
        text: "Referring to the exhibit, an ARP frame from a source MAC that is not the blocked one arrives. Which term handles it?",
        exhibit:
"filter L2SEC {\n" +
"  term drop-bad-mac { from source-mac-address 00:66:66:66:66:66/48; then discard; }\n" +
"  term allow-arp    { from ether-type arp; then accept; }\n" +
"  term default      { then discard; }\n" +
"}",
        options: [
          "Term allow-arp accepts it",
          "Term drop-bad-mac discards it",
          "Term default discards it",
          "Term allow-arp counts it then discards it"
        ],
        answer: 0, multi: false,
        explanation: "The source MAC does not match drop-bad-mac, so evaluation falls to allow-arp, which matches ether-type arp and accepts, stopping before the default discard. First matching terminating action wins." },
      { id: "X31", domain: "POLICY",
        text: "Where can a Layer 2 (ethernet-switching) firewall filter be applied?",
        options: [
          "At the port level or the VLAN level",
          "Only on the loopback interface",
          "Only on routed family inet interfaces",
          "Only on aggregated Ethernet bundles"
        ],
        answer: 0, multi: false,
        explanation: "Ethernet-switching filters apply at a port scope or a VLAN scope. The loopback is for control-plane protection with family inet/inet6, and L2 filters are not restricted to aggregated Ethernet." },
      { id: "X32", domain: "POLICY",
        text: "A storm-control profile specifies a bandwidth percentage but no action. During a broadcast storm exceeding the level, what happens?",
        options: [
          "The excess broadcast traffic is dropped, port stays up",
          "The interface is disabled until it is cleared",
          "The affected VLAN is removed from the port",
          "Spanning tree recalculates the root bridge"
        ],
        answer: 0, multi: false,
        explanation: "Without a configured action, storm control simply drops the excess broadcast, unknown-unicast, and multicast traffic while the port stays up. Disabling the port requires an explicit shutdown action; VLAN removal and root recalculation are unrelated." },
      { id: "X33", domain: "POLICY",
        text: "You must rate-limit ARP destined to the Routing Engine to blunt an ARP flood without dropping legitimate control traffic. Which approach fits?",
        options: [
          "An lo0 filter term matching ARP with a policer and then accept",
          "A storm-control profile applied directly to the loopback interface",
          "A longer global MAC-table aging timer configured on the switch",
          "A static ARP entry created for each of the control-plane neighbors"
        ],
        answer: 0, multi: false,
        explanation: "A control-plane filter term matching ARP with a policer rate-limits ARP toward the RE while still accepting conforming traffic. Storm control is a data-plane L2 feature, and aging timers or static ARP entries do not rate-limit control traffic." },

      // ================= BGP (8) =================
      { id: "X34", domain: "BGP",
        text: "Referring to the exhibit, which path is selected as active for 10.10.0.0/16?",
        exhibit:
"Path  NH        Local-Pref  AS-Path      Origin    MED  Peer\n" +
"A     reachable 120         65001 65002  IGP       0    EBGP\n" +
"B     reachable 120         65005        IGP       0    EBGP\n" +
"C     reachable 150         65001 65002  Incomplete 0   IBGP",
        options: [
          "Path C",
          "Path B",
          "Path A",
          "Path A and B, load-shared"
        ],
        answer: 0, multi: false,
        explanation: "Local preference is compared first after next-hop validity, and Path C's 150 beats the others' 120, so C is chosen immediately. AS-path length, origin, and the EBGP-over-IBGP rule are later tests that never apply here." },
      { id: "X35", domain: "BGP",
        text: "Referring to the exhibit, the active route is not advertised to the EBGP customer even though it is active. Why?",
        exhibit:
"Active: 198.51.100.0/24 (learned via IBGP)\n" +
"Export to customer group: [ REJECT-PRIVATE ACCEPT-BGP ]\n" +
"  REJECT-PRIVATE matches 198.51.100.0/24 then reject\n" +
"  ACCEPT-BGP matches protocol bgp then accept",
        options: [
          "An earlier export term rejects the prefix before the accept term",
          "IBGP-learned routes are never advertised to EBGP peers",
          "The prefix needs a community before it can be exported",
          "The customer session requires multihop to receive it"
        ],
        answer: 0, multi: false,
        explanation: "Export policies run in order; REJECT-PRIVATE matches and rejects the prefix before ACCEPT-BGP is reached. IBGP-learned routes can be advertised to EBGP peers, and neither a community nor multihop is required here." },
      { id: "X36", domain: "BGP",
        text: "Which two conditions must hold for Junos to compare MED between two BGP paths by default? (Choose two.)",
        options: [
          "The paths come from the same neighboring AS",
          "The earlier criteria have not already chosen a winner",
          "The two paths carry different local-preference values",
          "One path is EBGP and the other is IBGP"
        ],
        answer: [0, 1], multi: true,
        explanation: "By default MED is compared only among paths from the same neighbor AS and only if local-pref, AS-path, and origin have not already decided the winner. Differing local-pref would end selection earlier, and mixed peer type is a later tiebreaker." },
      { id: "X37", domain: "BGP",
        text: "You want customer routes advertised to your transit providers but withheld from your settlement-free peers. Which method scales best?",
        options: [
          "Tag routes with communities and match them in per-group export policies",
          "Enumerate every prefix explicitly in each neighbor's export policy",
          "Establish EBGP multihop to the peers you want to exclude",
          "Raise local preference on the customer routes"
        ],
        answer: 0, multi: false,
        explanation: "Community tagging with per-group export policies scales cleanly: mark customer routes, then advertise to transit while filtering them from peers by community. Per-prefix lists do not scale, and multihop or local preference do not control which neighbors receive a route." },
      { id: "X38", domain: "BGP",
        text: "Referring to the exhibit, a received prefix shows 'Accepted' but 'Inactive', with a better BGP path present and its next hop reachable. What does Inactive indicate here?",
        exhibit:
"user@r> show route 203.0.113.0/24 detail\n" +
"  203.0.113.0/24 (2 entries)\n" +
"    *BGP  ... active\n" +
"     BGP  ... Accepted, Inactive",
        options: [
          "It passed import policy but lost the best-path selection",
          "It was rejected by a term in the applied import policy",
          "Its advertised protocol next hop could not be resolved",
          "It matches an entry in the router's martian address list"
        ],
        answer: 0, multi: false,
        explanation: "Accepted but Inactive means import policy permitted the route but another path won best-path selection. A rejected route would not be Accepted, an unresolved next hop would be hidden/unusable, and martians are filtered outright." },
      { id: "X39", domain: "BGP",
        text: "What is the default route preference of BGP routes in Junos, for both EBGP and IBGP?",
        options: [
          "170 for both",
          "20 for EBGP and 200 for IBGP",
          "110 for both",
          "5 for EBGP and 170 for IBGP"
        ],
        answer: 0, multi: false,
        explanation: "In Junos both EBGP and IBGP routes use a default preference of 170; the EBGP-over-IBGP decision is a step inside the BGP best-path algorithm rather than a separate route-preference value as on some other platforms." },
      { id: "X40", domain: "BGP",
        text: "Referring to the exhibit, R3 cannot reach the IBGP-learned route's next hop. Which change on R1 most directly fixes reachability toward R3?",
        exhibit:
"R1 (IBGP) advertises to R3 (EBGP customer)\n" +
"Advertised next hop = 10.0.0.9, an address inside R1's AS unreachable by R3",
        options: [
          "Apply next-hop self on R1 toward R3",
          "Enable route flap damping on R3",
          "Configure R1 as a route reflector",
          "Prepend R1's AS on advertisements to R3"
        ],
        answer: 0, multi: false,
        explanation: "Setting next-hop self makes R1 advertise itself as the next hop, which R3 can reach, resolving the unusable internal next hop. Damping, route reflection, and AS prepending do not change next-hop reachability." },
      { id: "X41", domain: "BGP",
        text: "An EBGP session is Established but no routes are received, while the peer confirms it is advertising prefixes. Which local cause is most likely?",
        options: [
          "An import policy is rejecting the received routes",
          "The session still requires multihop to be set",
          "The peer and local AS numbers match",
          "The hold timer negotiated too high a value"
        ],
        answer: 0, multi: false,
        explanation: "With the session Established and the peer advertising, an import policy rejecting the routes is the most likely local reason none appear. Multihop and AS mismatch would prevent establishment, and hold-timer negotiation does not block route receipt." },

      // ================= IS-IS (6) =================
      { id: "X42", domain: "ISIS",
        text: "Referring to the exhibit, R1 is Level 1 only and is not learning routes to a remote area. What is the standard mechanism it depends on?",
        exhibit:
"R1: level 1 only, area 49.0001\n" +
"Remote prefixes are in area 49.0002, reached across the L2 backbone.",
        options: [
          "A default route from the nearest L1/L2 router via the attached bit",
          "A virtual link stitched across the two areas",
          "Redistribution of L2 routes into L1 on R1 itself",
          "A statically configured system ID matching the remote router"
        ],
        answer: 0, multi: false,
        explanation: "An L1-only router reaches other areas via the nearest L1/L2 router, which sets the attached bit so L1 routers install a default toward it. IS-IS has no virtual links, R1 cannot itself leak L2 into L1 as an L1-only node, and system IDs must be unique." },
      { id: "X43", domain: "ISIS",
        text: "Which statement about IS-IS metrics is correct?",
        options: [
          "Wide metrics are required for per-link values above 63",
          "Narrow metrics allow per-link values up to 1023",
          "Metrics are derived from interface bandwidth by default",
          "The default interface metric increases with link speed"
        ],
        answer: 0, multi: false,
        explanation: "Narrow metrics cap a link at 63, so wide metrics are needed for larger values and for TE. Junos uses a fixed default metric of 10 regardless of speed, so metrics are not bandwidth-derived nor speed-scaled." },
      { id: "X44", domain: "ISIS",
        text: "Referring to the exhibit, what is the purpose of the periodic CSNP that the DIS sends on the LAN?",
        exhibit:
"R2 is the DIS on the LAN.\n" +
"Approximately every 10 seconds R2 multicasts a CSNP listing LSP headers.",
        options: [
          "It lets other routers detect and request missing or stale LSPs",
          "It performs the periodic DIS election on the segment",
          "It establishes adjacencies with new neighbors",
          "It withdraws the pseudonode LSP from the LAN"
        ],
        answer: 0, multi: false,
        explanation: "The DIS multicasts CSNPs summarizing the database so routers can spot and request anything missing or outdated via PSNPs, keeping databases synchronized. It does not run elections, form adjacencies, or withdraw the pseudonode." },
      { id: "X45", domain: "ISIS",
        text: "You need a backbone link to carry only Level 2 and never attempt Level 1 adjacencies. Which configuration achieves this?",
        options: [
          "Set the interface to level 1 disable",
          "Set the interface to passive",
          "Set the interface metric to 63",
          "Set the interface priority to 127"
        ],
        answer: 0, multi: false,
        explanation: "Disabling Level 1 on the interface restricts it to Level 2, so only L2 adjacencies form. Passive advertises but forms no adjacency at all, and metric or priority values do not restrict the level." },
      { id: "X46", domain: "ISIS",
        text: "Two routers form a Level 2 adjacency but not Level 1, though both are L1/L2. Which mismatch causes L1 to fail while L2 succeeds?",
        options: [
          "Different area addresses",
          "Different system identifiers",
          "Different hostnames",
          "Different loopback masks"
        ],
        answer: 0, multi: false,
        explanation: "Differing area addresses block the Level 1 adjacency while the area-independent Level 2 adjacency still forms. System IDs must be unique, and hostnames or loopback masks do not gate adjacency levels." },
      { id: "X47", domain: "ISIS",
        text: "Which command first confirms whether an IS-IS adjacency is up and at which level?",
        options: [
          "show isis adjacency",
          "show isis database",
          "show route protocol isis",
          "show isis spf log"
        ],
        answer: 0, multi: false,
        explanation: "'show isis adjacency' lists neighbors with their state and level, the first check for adjacency issues. The database, route, and SPF-log commands are useful only after the adjacency state is known." },

      // ================= PROTOCOL-INDEPENDENT ROUTING (5) =================
      { id: "X48", domain: "PIR",
        text: "Referring to the exhibit, which next hop does the router use for 10.2.3.4?",
        exhibit:
"user@r> show route 10.2.3.4\n" +
"  10.0.0.0/8    *[Static/5]  via ge-0/0/1.0\n" +
"  10.2.0.0/16   *[BGP/170]   via ge-0/0/2.0\n" +
"  0.0.0.0/0     *[Static/5]  via ge-0/0/9.0",
        options: [
          "ge-0/0/2.0",
          "ge-0/0/1.0",
          "ge-0/0/9.0",
          "All three, load-shared"
        ],
        answer: 0, multi: false,
        explanation: "Forwarding uses the longest matching prefix; 10.2.0.0/16 is more specific for 10.2.3.4 than 10.0.0.0/8 or the default, so the BGP route via ge-0/0/2.0 is used despite its higher preference. Preference only breaks ties between identical prefixes." },
      { id: "X49", domain: "PIR",
        text: "How does a generated route differ from an aggregate route once it is active?",
        options: [
          "It inherits the next hop of its primary contributing route",
          "It always uses a discard next hop",
          "It adopts the next hop of the default route",
          "It requires no contributing route to remain active"
        ],
        answer: 0, multi: false,
        explanation: "A generated route takes the next hop of its primary contributing route, giving a real forwarding path, whereas an aggregate defaults to a reject next hop. Both need a contributing more-specific route to stay active." },
      { id: "X50", domain: "PIR",
        text: "Referring to the exhibit, what effect does this configuration have on OSPF routes?",
        exhibit:
"routing-options rib-groups OSPF-LEAK {\n" +
"  import-rib [ inet.0 CUST.inet.0 ];\n" +
"}\n" +
"protocols ospf rib-group OSPF-LEAK;",
        options: [
          "OSPF installs its routes into both inet.0 and CUST.inet.0",
          "OSPF stops installing routes into inet.0",
          "OSPF routes are converted into aggregate routes",
          "OSPF forms adjacencies inside the CUST instance"
        ],
        answer: 0, multi: false,
        explanation: "A rib-group whose import-rib lists multiple tables makes the protocol install routes into all of them, so OSPF routes populate both inet.0 and CUST.inet.0. It does not stop primary-table installation, create aggregates, or move adjacencies." },
      { id: "X51", domain: "PIR",
        text: "You need a summary advertised only while a component prefix exists, and it must forward over a real path rather than reject. Which route type fits?",
        options: [
          "A generated route",
          "An aggregate route",
          "A static discard route",
          "A martian entry"
        ],
        answer: 0, multi: false,
        explanation: "A generated route activates only with a contributor and inherits that contributor's real next hop, meeting both requirements. An aggregate would use a reject next hop by default, and discard/martian entries do not summarize with a forwarding path." },
      { id: "X52", domain: "PIR",
        text: "Referring to the exhibit, filter-based forwarding is configured but matched traffic is dropped. What is missing?",
        exhibit:
"routing-instances ALT { instance-type forwarding; routing-options { } }\n" +
"firewall filter FBF { term t1 { from source-address 192.168.7.0/24; then routing-instance ALT; } }\n",
        options: [
          "A rib-group populating ALT.inet.0 with resolving routes",
          "A second firewall filter applied on egress",
          "An aggregate route inside instance ALT",
          "A load-balancing policy on the forwarding table"
        ],
        answer: 0, multi: false,
        explanation: "The forwarding instance's table is empty, so matched traffic cannot resolve a next hop and is dropped. A rib-group must import the interface and next-hop routes into ALT.inet.0. A second filter, an aggregate, or a balancing policy does not populate the table." },

      // ================= HIGH AVAILABILITY / TUNNELS (8) =================
      { id: "X53", domain: "HA",
        text: "Referring to the exhibit, which set of features is enabled, and what is preserved across a Routing Engine switchover?",
        exhibit:
"user@r> show system switchover\n" +
"  Graceful switchover: On\n" +
"  Nonstop-routing:     On\n" +
"  Nonstop-bridging:    On",
        options: [
          "Forwarding, Layer 3 routing state, and Layer 2 state are all preserved",
          "Only the forwarding plane is preserved",
          "Only Layer 2 bridging state is preserved",
          "Nothing is preserved unless VRRP is added"
        ],
        answer: 0, multi: false,
        explanation: "GRES preserves kernel/forwarding state, NSR preserves Layer 3 routing-protocol state, and NSB preserves Layer 2 state, so all three are maintained. The other options understate what this combination provides." },
      { id: "X54", domain: "HA",
        text: "Which statement about Virtual Chassis mastership selection is correct?",
        options: [
          "Highest priority wins and a running master is not preempted by default",
          "The lowest member MAC always wins and preempts the current master role",
          "The most recently added member always takes over as the master switch",
          "Mastership is reassigned at random among members on every system reboot"
        ],
        answer: 0, multi: false,
        explanation: "VC mastership favors the highest priority with deterministic tiebreakers, and a running master is not preempted by default when a higher-priority member joins later. The other statements misstate the election and preemption behavior." },
      { id: "X55", domain: "HA",
        text: "An access switch needs active/standby uplinks to two different distribution switches, with fast failover and no spanning tree. Which feature fits?",
        options: [
          "Redundant trunk group",
          "A single LAG spanning both distribution switches",
          "VRRP configured on the access switch",
          "MSTP with two mapped instances"
        ],
        answer: 0, multi: false,
        explanation: "A redundant trunk group gives active/standby uplinks with fast failover and no spanning tree, which suits uplinks to two separate distribution switches. A plain LAG needs one peer (or MC-LAG), VRRP is a gateway feature, and MSTP is spanning tree." },
      { id: "X56", domain: "HA",
        text: "Referring to the exhibit, BFD is configured for the OSPF adjacency. What detection time results, and what follows when it fires?",
        exhibit:
"protocols ospf area 0 interface ge-0/0/0.0 {\n" +
"  bfd-liveness-detection { minimum-interval 250; multiplier 3; }\n" +
"}",
        options: [
          "About 750 ms, after which OSPF tears down and reconverges",
          "About 250 ms, after which OSPF ignores the event",
          "About 3 seconds, after which the interface is disabled",
          "About 75 ms, after which only BGP is affected"
        ],
        answer: 0, multi: false,
        explanation: "Detection is roughly interval times multiplier, 250 ms times 3 equals 750 ms; when BFD declares the neighbor down, OSPF immediately tears down the adjacency and reconverges rather than waiting for the dead interval." },
      { id: "X57", domain: "HA",
        text: "Which two statements about a LAG with LACP are correct? (Choose two.)",
        options: [
          "All properly negotiated members forward at the same time",
          "LACP keeps mismatched or silent members out of the bundle",
          "Only one member forwards while the rest stand by",
          "The bundle needs spanning tree to avoid an internal loop"
        ],
        answer: [0, 1], multi: true,
        explanation: "A LAG forwards on all correctly negotiated members and LACP excludes members that mismatch or do not respond. Active/standby describes an RTG, and the bundle is one logical link so no spanning tree is needed over it." },
      { id: "X58", domain: "HA",
        text: "Traffic must traverse a GRE tunnel between two enterprise sites over the Internet. Which two conditions are required? (Choose two.)",
        options: [
          "Each endpoint routes the site traffic into the tunnel interface",
          "The underlay can reach the tunnel's outer endpoint addresses",
          "Every ISP router has a route to the inner private subnets",
          "An encryption profile is applied to the GRE tunnel"
        ],
        answer: [0, 1], multi: true,
        explanation: "The tunnel is used when each end routes the intended traffic into the gr- interface and the underlay reaches the outer endpoint addresses. Intermediate routers forward only the outer packet and need not know the inner subnets, and GRE does not require encryption to carry traffic." },
      { id: "X59", domain: "HA",
        text: "Referring to the exhibit, large DF-set pings across a GRE tunnel fail while small pings succeed. What is the fix?",
        exhibit:
"ping 10.20.20.1 size 1500 do-not-fragment  -> fail\n" +
"ping 10.20.20.1 size 500                     -> success\n" +
"Tunnel gr-0/0/0 rides over an Internet path.",
        options: [
          "Lower the tunnel MTU or clamp the TCP MSS to fit the encapsulation",
          "Enable MACsec encryption on the GRE tunnel interface at both ends",
          "Move the tunnel interface into a dedicated VLAN on both endpoints",
          "Disable the interior gateway protocol that runs across the tunnel"
        ],
        answer: 0, multi: false,
        explanation: "GRE overhead lowers the effective MTU, so large DF packets exceed it and are dropped while small ones pass. Lowering the tunnel MTU, clamping MSS, or allowing PMTUD resolves it; MACsec, VLANs, and the IGP are not involved." },
      { id: "X60", domain: "HA",
        text: "How does graceful restart differ from nonstop active routing when surviving a control-plane event?",
        options: [
          "Graceful restart relies on helper neighbors while NSR preserves state internally",
          "Graceful restart preserves state internally while NSR relies on helpers",
          "Both rely on cooperating helper neighbors to keep forwarding",
          "Both operate on a single Routing Engine without any backup"
        ],
        answer: 0, multi: false,
        explanation: "Graceful restart depends on neighbors acting as helpers during a restart, whereas NSR replicates protocol state to a backup RE so neighbors are unaware. NSR therefore needs dual REs and no neighbor cooperation, which the other options get backwards." }
    ]
  };

  if (typeof ENT_CERT !== "undefined" && ENT_CERT && Array.isArray(ENT_CERT.exams)) {
    var idx = 0;
    for (var i = 0; i < ENT_CERT.exams.length; i++) { if (ENT_CERT.exams[i].id === "ENT-VOUCHER-2") { idx = i + 1; break; } }
    ENT_CERT.exams.splice(idx, 0, EXAM);
  }
  if (typeof module !== "undefined") { module.exports = { ENT_VOUCHER_EXAM_3: EXAM }; }
})();
