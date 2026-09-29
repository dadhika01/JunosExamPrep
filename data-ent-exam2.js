/*
 * JNCIS-ENT (JN0-352) — Full-length Mock Exam #2 (HARD, hint-free).
 * 60 questions, 90-minute fixed clock (timeLimitSec: 5400).
 *
 * Design rules (per user feedback):
 *  - Exhibits are neutral raw CLI/output: they do NOT contain comments that
 *    reveal the answer.
 *  - Options contain NO parenthetical hints/explanations and NO "because ..."
 *    justifications; the reasoning lives only in q.explanation (shown after
 *    submission on the review screen).
 *  - Distractors are closely related to the correct answer (same topic/keyword
 *    family) so the answer cannot be found by category or by length.
 *  - This exam is exempt from the automatic length-padding in data.js; option
 *    lengths are hand-kept comparable.
 *
 * Weighting: STP 9, OSPF 10, L2 switching 7, L2 security/filters 7,
 * BGP 8, IS-IS 6, PIR 5, HA/tunnels 8 = 60. No repeats of any existing ENT question.
 */
(function () {
  var EXAM = {
    id: "ENT-VOUCHER-2",
    name: "★ Full Mock 2 — 60 Q / 90 min (Hard)",
    description: "Full-length, hint-free exam with tight, closely-related distractors and neutral exhibits. Harder interpretation and multi-step reasoning. 60 questions, 90-minute clock.",
    timeLimitSec: 5400,
    questions: [
      // ================= SPANNING TREE (9) =================
      { id: "W1", domain: "STP",
        text: "Referring to the exhibit, SW1 and SW2 each report themselves as root for the instance on the link between them. Both links are up and both use the same bridge priority. What is the most likely cause?",
        exhibit:
"SW1> show spanning-tree bridge\n" +
"  Root ID         : 4096.00:1f:aa:11:11:11\n" +
"  This bridge ID  : 4096.00:1f:aa:11:11:11\n" +
"  STP mode        : VSTP (vlan 10)\n" +
"SW2> show spanning-tree bridge\n" +
"  Root ID         : 4096.00:1f:bb:22:22:22\n" +
"  This bridge ID  : 4096.00:1f:bb:22:22:22\n" +
"  STP mode        : MSTP",
        options: [
          "The two switches run incompatible spanning-tree modes on the shared link",
          "The equal bridge priorities force each switch to claim the root role for itself",
          "The interface path cost is set so high that neither switch evaluates the BPDUs",
          "The per-instance MAC addresses differ and this blocks the root-bridge election"
        ],
        answer: 0, multi: false,
        explanation: "SW1 runs VSTP and SW2 runs MSTP on the shared link. Their BPDU formats are not compatible for the instance, so neither accepts the other's superior BPDU and each remains root of its own tree. Equal priorities are legal (the lower MAC would break the tie if BPDUs were exchanged), and cost/MAC differences do not stop root election." },
      { id: "W2", domain: "STP",
        text: "On a point-to-point RSTP link, a designated port reaches the forwarding state without waiting for a transition timer. Which mechanism makes this possible?",
        options: [
          "The proposal and agreement handshake with the peer",
          "The max-age timer expiring early on the segment",
          "Topology-change notifications flooded toward the root",
          "The forward-delay timer being halved automatically"
        ],
        answer: 0, multi: false,
        explanation: "RSTP uses a proposal/agreement (sync) handshake on point-to-point links so a designated port moves to forwarding as soon as the neighbor agrees, avoiding the legacy listening/learning delay. The other items are timers or notifications that do not drive rapid transition." },
      { id: "W3", domain: "STP",
        text: "A Junos switch receives an RSTP topology-change notification on its root port. How does it treat the MAC addresses learned on its other non-edge ports?",
        options: [
          "It flushes MAC entries on all non-edge ports except the receiving one",
          "It flushes the MAC entries only on the single port that received the change",
          "It retains every MAC entry and simply lets them age out at the normal rate",
          "It shortens the MAC-table aging timer down to the current forward-delay value"
        ],
        answer: 0, multi: false,
        explanation: "On a topology change RSTP flushes MACs on all non-edge ports except the port on which the change arrived, forcing rapid relearning. Flushing only the receiving port, relying on normal aging, or merely shortening the timer would all slow reconvergence." },
      { id: "W4", domain: "STP",
        text: "A BPDU-protected edge port was placed in an error state after receiving a BPDU. Which condition returns it to service without operator action?",
        options: [
          "Expiry of a configured disable-timeout",
          "Receipt of the next periodic hello",
          "Election of a new root bridge",
          "A flush of the MAC address table"
        ],
        answer: 0, multi: false,
        explanation: "A BPDU-protected port recovers on a manual clear or automatically only when a disable-timeout is configured and expires. Hellos, a root change, or MAC-table flushing do not re-enable it." },
      { id: "W5", domain: "STP",
        text: "Two switches are joined by two parallel links in the same VLAN with no aggregation. On the non-root switch, one port becomes the root port. Which role does RSTP assign to the second port?",
        options: [
          "Alternate port",
          "Backup port",
          "Designated port",
          "Disabled port"
        ],
        answer: 0, multi: false,
        explanation: "The second port offers a redundant path toward the root, so it is an alternate port (blocking). A backup port applies to a redundant link to the same segment served by this bridge's own designated port; it is neither designated nor disabled here." },
      { id: "W6", domain: "STP",
        text: "Root guard is configured on an interface. A superior BPDU is then received on that interface. Which state does the port enter, and how does it recover?",
        options: [
          "Root-inconsistent blocking, clearing itself once the superior BPDUs stop",
          "Error-disabled state that recovers only on an explicit manual clear command",
          "Listening state that recovers automatically after the forward-delay timer",
          "Forwarding state as the newly elected root port with no recovery required"
        ],
        answer: 0, multi: false,
        explanation: "Root guard moves the port to a root-inconsistent (blocking) state on a superior BPDU and restores it automatically once those BPDUs cease. That differs from BPDU protect, which error-disables the port and needs a clear or disable-timeout." },
      { id: "W7", domain: "STP",
        text: "Referring to the exhibit, which interface becomes the root port on SW-X?",
        exhibit:
"SW-X reaches the root bridge two ways:\n" +
"  ge-0/0/1 -> SW-Y -> root   local cost 20000, cost advertised by SW-Y 20000\n" +
"  ge-0/0/2 -> SW-Z -> root   local cost 20000, cost advertised by SW-Z 0\n" +
"  Sender bridge IDs: SW-Y = 32768.00:00:00:00:00:0a, SW-Z = 32768.00:00:00:00:00:14",
        options: [
          "ge-0/0/2",
          "ge-0/0/1",
          "Both, as an equal-cost pair",
          "Neither, both are alternate"
        ],
        answer: 0, multi: false,
        explanation: "Root-port selection compares cumulative root path cost first. Via ge-0/0/2 the total is 20000 (20000+0); via ge-0/0/1 it is 40000 (20000+20000). ge-0/0/2 wins on cost, so sender bridge ID and port ID are never consulted." },
      { id: "W8", domain: "STP",
        text: "Which two statements about RSTP edge ports are correct? (Choose two.)",
        options: [
          "An edge port moves directly to forwarding without the listening and learning states",
          "An edge port that receives a BPDU loses edge status and behaves as a normal port",
          "An edge port originates a topology-change notification each time a host link comes up",
          "An edge port is always selected as the bridge's root port"
        ],
        answer: [0, 1], multi: true,
        explanation: "Edge ports skip the transition states and forward immediately, and they revert to normal STP operation if a BPDU is ever received. They do not generate topology-change notifications on host link changes, and edge status is unrelated to root-port selection." },
      { id: "W9", domain: "STP",
        text: "How does MSTP present a region to switches outside that region, such as a neighboring RSTP bridge?",
        options: [
          "As a single logical bridge via the common and internal spanning tree",
          "As one separate instance advertised per VLAN in the region",
          "As a transparent segment that forwards all BPDUs unchanged",
          "As multiple root bridges, one per mapped instance"
        ],
        answer: 0, multi: false,
        explanation: "MSTP's CST/IST makes an entire region look like one logical bridge to the outside, keeping inter-region topology loop-free while MSTIs handle VLAN groups internally. It does not expose per-VLAN or per-instance roots externally, nor does it forward BPDUs transparently." },

      // ================= OSPF (10) =================
      { id: "W10", domain: "OSPF",
        text: "Referring to the exhibit, the adjacency will not form. Comparing the two Hellos, which parameter is mismatched?",
        exhibit:
"OSPF sent Hello 10.1.1.1 -> 224.0.0.5 (ge-0/0/0.0 area 0.0.0.0)\n" +
"  hello_ivl 10, dead_ivl 40, mask 255.255.255.0, options 0x2\n" +
"OSPF rcvd Hello 10.1.1.2 -> 224.0.0.5 (ge-0/0/0.0 area 0.0.0.0)\n" +
"  hello_ivl 10, dead_ivl 40, mask 255.255.255.252, options 0x2",
        options: [
          "The interface subnet mask",
          "The hello interval",
          "The area identifier",
          "The stub option bit"
        ],
        answer: 0, multi: false,
        explanation: "Hello/dead timers (10/40), area (0.0.0.0), and the options byte (0x2) all match, but the masks differ: /24 versus /30. On broadcast and point-to-point links OSPF requires matching subnet/mask, so this mismatch blocks the adjacency." },
      { id: "W11", domain: "OSPF",
        text: "An ABR sits between area 0 and a totally stubby area. Which LSAs does it advertise into the totally stubby area?",
        options: [
          "A single Type 3 default route only",
          "Type 3 summaries for each inter-area prefix",
          "Type 3 summaries plus Type 5 externals",
          "Type 7 externals translated from Type 5"
        ],
        answer: 0, multi: false,
        explanation: "Into a totally stubby area the ABR suppresses specific Type 3 summaries and all Type 4/5 externals, injecting just one Type 3 default route. Specific summaries appear in a normal stub area, Type 5 never enters any stub variant, and Type 7 exists only in an NSSA." },
      { id: "W12", domain: "OSPF",
        text: "Referring to the exhibit, R1 has the external LSA in its database but does not install the 10.20.20.0/24 route. What explains this?",
        exhibit:
"R1> show ospf database external\n" +
"  Type    ID          Adv Rtr    Age\n" +
"  Extern  10.20.20.0  10.0.0.9   210\n" +
"R1> show route 10.0.0.9\n" +
"  (no entry)\n" +
"R1> show ospf database router | match 10.0.0.9\n" +
"  (no entry)",
        options: [
          "The ASBR that originated the LSA is unreachable in the OSPF topology",
          "The external LSA has already exceeded its configured maximum age limit",
          "R1 resides in a stub area whose ABR blocks the external LSA from entering",
          "The external route uses metric type E2 and must be E1 before installation"
        ],
        answer: 0, multi: false,
        explanation: "An OSPF external route installs only if its advertising ASBR is reachable. R1 has no route or router LSA for 10.0.0.9, so the forwarding path cannot be resolved and the route is withheld. The LSA age is fine, R1 is clearly not in a stub area (it holds a Type 5), and metric type does not gate installation." },
      { id: "W13", domain: "OSPF",
        text: "An interface is configured with 'set protocols ospf area 0 interface ge-0/0/1 metric 500'. What does this value override?",
        options: [
          "The cost derived for that interface from the reference bandwidth",
          "The reference bandwidth value applied across every OSPF interface",
          "The dead interval used before declaring the neighbor down on that link",
          "The router-wide delay applied before each SPF recalculation runs"
        ],
        answer: 0, multi: false,
        explanation: "An explicit interface metric sets that interface's OSPF cost directly, overriding the reference-bandwidth formula for that link only. It does not change the router's reference bandwidth, the dead interval, or SPF timing." },
      { id: "W14", domain: "OSPF",
        text: "On a multi-access broadcast segment, which router originates the Network LSA and which LSA type is it?",
        options: [
          "The DR originates a Type 2 LSA",
          "The DR originates a Type 1 LSA",
          "Each router originates its own Type 2 LSA",
          "The ABR originates a Type 3 LSA"
        ],
        answer: 0, multi: false,
        explanation: "The DR originates the Type 2 Network LSA describing the segment and its attached routers. Type 1 Router LSAs are originated by every router for their own links, and Type 3 summaries come from an ABR, not on the segment itself." },
      { id: "W15", domain: "OSPF",
        text: "Referring to the exhibit, R1 and R2 are Full, but R1 never learns 10.2.2.2/32. What is the most likely reason?",
        exhibit:
"R2> show configuration protocols ospf\n" +
"  area 0.0.0.0 { interface ge-0/0/0.0; }\n" +
"R2> show configuration interfaces lo0\n" +
"  unit 0 { family inet { address 10.2.2.2/32; } }",
        options: [
          "The loopback interface is not configured under the OSPF area",
          "The loopback address must first be added to an OSPF export policy",
          "OSPF advertises a loopback only when the area is configured as a stub",
          "The loopback mask must be shortened before OSPF will carry the prefix"
        ],
        answer: 0, multi: false,
        explanation: "OSPF only advertises interfaces enabled under OSPF. R2's lo0 is not under the OSPF area, so 10.2.2.2/32 is never originated. Adding lo0 to the area (usually passive) fixes it; export policy, stub status, and mask length are not the issue." },
      { id: "W16", domain: "OSPF",
        text: "On a Junos broadcast interface, what is the default OSPF interface priority, and what is the effect of setting it to 0?",
        options: [
          "128; the interface can no longer be elected DR or BDR",
          "1; the interface is forced to win the DR election",
          "128; the interface stops forming any adjacency",
          "0; the setting has no effect on the election"
        ],
        answer: 0, multi: false,
        explanation: "The default is 128. A priority of 0 makes the interface ineligible for DR/BDR but it still forms adjacencies with the elected DR/BDR. It does not force a win or disable adjacencies." },
      { id: "W17", domain: "OSPF",
        text: "For destination 10.1.2.3, a router holds an inter-area summary for 10.0.0.0/8 and an intra-area route for 10.1.0.0/16. Which route forwards the packet?",
        options: [
          "The 10.1.0.0/16 intra-area route",
          "The 10.0.0.0/8 summary route",
          "Whichever has the lower OSPF cost",
          "Whichever was installed into the table first"
        ],
        answer: 0, multi: false,
        explanation: "Forwarding uses the longest matching prefix; 10.1.0.0/16 is more specific than 10.0.0.0/8 for 10.1.2.3, so it is chosen regardless of LSA type, cost, or install order. Cost only compares identical prefixes." },
      { id: "W18", domain: "OSPF",
        text: "Which two parameters must match for two OSPF routers to reach the 2-Way state on a shared link? (Choose two.)",
        options: [
          "The hello and dead intervals",
          "The area identifier on the link",
          "The OSPF router identifiers",
          "The reference-bandwidth setting"
        ],
        answer: [0, 1], multi: true,
        explanation: "Matching hello/dead timers and the area ID (along with subnet/mask, authentication, and stub flags) are required to become neighbors. Router IDs must instead be unique, and reference bandwidth is locally significant and never exchanged." },
      { id: "W19", domain: "OSPF",
        text: "You want a router to advertise a subnet into OSPF but never form an adjacency on that interface. Which configuration achieves this?",
        options: [
          "Configure the interface as passive under OSPF",
          "Set the interface OSPF metric to 0",
          "Place the interface in a stub area",
          "Set the interface priority to 0"
        ],
        answer: 0, multi: false,
        explanation: "A passive OSPF interface is advertised into the LSDB but sends and accepts no Hellos, so no adjacency forms. A zero metric or zero priority still allows adjacencies, and stub-area membership does not by itself suppress Hellos." },

      // ================= LAYER 2 SWITCHING / VLANs (7) =================
      { id: "W20", domain: "L2",
        text: "Referring to the exhibit, a VLAN 30 host on SW-A cannot reach a VLAN 30 host on SW-B, although the trunk is up and both access ports are correct. What resolves it?",
        exhibit:
"SW-A ge-0/0/24 { interface-mode trunk; vlan members [ 10 20 ]; }\n" +
"SW-B ge-0/0/24 { interface-mode trunk; vlan members [ 10 20 30 ]; }",
        options: [
          "Add VLAN 30 to the trunk members on SW-A",
          "Add an IRB for VLAN 30 on both switches",
          "Set VLAN 30 as the trunk native VLAN on SW-A",
          "Enable MVRP on SW-B only"
        ],
        answer: 0, multi: false,
        explanation: "SW-A's trunk does not carry VLAN 30, so those frames never traverse the link. Adding VLAN 30 to SW-A's trunk members restores same-VLAN reachability. An IRB is for routing between VLANs, a native VLAN change would carry it untagged (mismatched), and single-sided MVRP does not fix the missing member." },
      { id: "W21", domain: "L2",
        text: "A trunk is configured with 'native-vlan-id 99', but VLAN 99 is not included in the interface's vlan members list. How are untagged frames received on that trunk handled?",
        options: [
          "They are dropped",
          "They are tagged into VLAN 1",
          "They are flooded across every configured VLAN",
          "They are placed into the lowest-numbered member VLAN"
        ],
        answer: 0, multi: false,
        explanation: "The native VLAN must also be a member of the trunk for untagged frames to be accepted into it. With VLAN 99 named as native but absent from the members list, untagged frames are dropped rather than retagged, flooded, or reassigned." },
      { id: "W22", domain: "L2",
        text: "A frame arrives whose destination MAC is not present in the Ethernet switching table. How does the switch handle it?",
        options: [
          "Floods it out all other ports in the same VLAN",
          "Discards it until the destination is learned",
          "Forwards a copy to the Routing Engine for learning",
          "Forwards it only out the trunk ports of the VLAN"
        ],
        answer: 0, multi: false,
        explanation: "Unknown-unicast frames are flooded to all ports in the VLAN except the ingress port; the reply then teaches the switch the MAC. The frame is neither discarded, punted to the RE, nor restricted to trunk ports." },
      { id: "W23", domain: "L2",
        text: "Referring to the exhibit, which statement about MAC 00:05:aa:bb:cc:dd is correct?",
        exhibit:
"user@sw> show ethernet-switching table\n" +
"  VLAN  MAC address        Type     Interface\n" +
"  v10   00:05:aa:bb:cc:dd  Static   ge-0/0/3.0\n" +
"  v10   00:05:11:22:33:44  Dynamic  ge-0/0/4.0",
        options: [
          "It is pinned to ge-0/0/3.0 and will not age out",
          "It was learned dynamically and ages out after 300 seconds",
          "It is a group address and is flooded in VLAN 10",
          "It is being held down by storm control"
        ],
        answer: 0, multi: false,
        explanation: "A Static entry is administratively bound to the interface and does not age, unlike the Dynamic entry that ages after the default 300 seconds. Nothing marks it as a group address or a storm-control action." },
      { id: "W24", domain: "L2",
        text: "An IP phone on an access port must tag its voice traffic while the PC behind it stays untagged. How does the phone normally learn the voice VLAN ID?",
        options: [
          "From LLDP-MED advertised by the switch",
          "From the switch's spanning-tree BPDUs",
          "From the DHCP snooping binding table",
          "From GVRP membership announcements"
        ],
        answer: 0, multi: false,
        explanation: "LLDP-MED conveys the voice VLAN and QoS policy to the phone, which then tags voice traffic while the PC remains untagged in the data VLAN. BPDUs, DHCP snooping bindings, and GVRP do not carry the voice VLAN assignment." },
      { id: "W25", domain: "L2",
        text: "A server's MAC must remain bound to one access port and must not be relearned on any other port. Which approach best enforces this?",
        options: [
          "Configure a static MAC entry for the address on that port",
          "Raise the interface MAC-limit to a higher value",
          "Increase the global MAC aging timer",
          "Enable root guard on the server's port"
        ],
        answer: 0, multi: false,
        explanation: "Pinning the address as a static MAC entry (optionally with persistent learning or MAC-move limiting) keeps it on the intended port and blocks relearning elsewhere. A higher MAC-limit, a longer aging timer, or root guard do not restrict where a MAC may appear." },
      { id: "W26", domain: "L2",
        text: "Without provider tagging, how many VLAN IDs are usable on a single trunk, and which field determines that limit?",
        options: [
          "4094, set by the 12-bit VLAN ID field",
          "1024, set by the 10-bit priority field",
          "4096, set by the 12-bit VLAN ID field",
          "8191, set by the 13-bit tag control field"
        ],
        answer: 0, multi: false,
        explanation: "The 802.1Q VLAN ID is 12 bits (0–4095); 0 and 4095 are reserved, leaving 1–4094 usable. The count is 4094 (not 4096), the priority field is 3 bits, and there is no 13-bit VLAN field." },

      // ================= LAYER 2 SECURITY + FILTERS (7) =================
      { id: "W27", domain: "L2",
        text: "Referring to the exhibit, DAI is enabled on VLAN 10. The ARP shown arrives on an untrusted port. What action does the switch take?",
        exhibit:
"DHCP snooping binding, VLAN 10:\n" +
"  IP 10.10.10.50   MAC 00:aa:00:00:00:07   Interface ge-0/0/9.0\n" +
"ARP on ge-0/0/12.0: sender-ip 10.10.10.50  sender-mac 00:bb:bb:bb:bb:bb",
        options: [
          "It discards the ARP as a binding violation",
          "It updates the binding to the new port and MAC",
          "It forwards the ARP and adds a second binding",
          "It accepts the ARP and refreshes the lease timer"
        ],
        answer: 0, multi: false,
        explanation: "DAI validates ARPs on untrusted ports against the snooping bindings. The sender IP maps to a different MAC and port than the binding, so the ARP fails validation and is discarded. It does not overwrite, duplicate, or accept the binding." },
      { id: "W28", domain: "L2",
        text: "IP source guard is enabled on an access port. A host with a static IP and no DHCP lease loses connectivity. What is the direct fix?",
        options: [
          "Add a static IP-source-guard binding for the host",
          "Enable MACsec on the access port",
          "Convert the access port to a trunk",
          "Raise the storm-control level on the port"
        ],
        answer: 0, multi: false,
        explanation: "IP source guard forwards only source addresses that match a DHCP snooping binding; a static host has none, so its traffic is dropped. Adding a static binding (or exempting the port) restores it. MACsec, trunking, and storm control are unrelated to this drop." },
      { id: "W29", domain: "L2",
        text: "Which two threats does DHCP snooping directly mitigate on access ports? (Choose two.)",
        options: [
          "A rogue DHCP server offering incorrect gateways",
          "DHCP starvation that exhausts the server's address pool",
          "MAC flooding that overflows the switching table",
          "Spanning-tree takeover by a lower-priority bridge"
        ],
        answer: [0, 1], multi: true,
        explanation: "DHCP snooping blocks server messages on untrusted ports (stopping rogue servers) and, with rate limiting, curbs DHCP starvation. MAC flooding is countered by MAC limiting and spanning-tree takeover by root guard — different features entirely." },
      { id: "W30", domain: "POLICY",
        text: "Referring to the exhibit, a frame with source MAC 00:de:ad:be:ef:01 destined to TCP port 23 enters VLAN 10. Which term acts on it?",
        exhibit:
"filter L2 {\n" +
"  term t1 { from source-mac-address 00:de:ad:be:ef:01/48; then accept; }\n" +
"  term t2 { from destination-port telnet; then discard; }\n" +
"  term t3 { then accept; }\n" +
"}",
        options: [
          "Term t1 accepts it",
          "Term t2 discards it",
          "Term t3 accepts it",
          "Term t2 counts and then discards it"
        ],
        answer: 0, multi: false,
        explanation: "Filters stop at the first term with a matching terminating action. The source MAC matches t1, which accepts, so t2's telnet discard is never evaluated. Term order is what makes t1 win here." },
      { id: "W31", domain: "POLICY",
        text: "An lo0 filter permits SSH, BGP, and ICMP and ends with 'then discard'. After committing, BFD sessions to neighbors drop. What is the cause?",
        options: [
          "The filter discards BFD packets destined to the Routing Engine",
          "BFD cannot be filtered by an lo0 firewall filter",
          "The discard term must be placed before the accept terms",
          "BFD requires the filter to be applied on the physical port"
        ],
        answer: 0, multi: false,
        explanation: "A control-plane filter drops anything not explicitly permitted before its terminating discard; BFD to the RE is not permitted, so it is dropped and sessions fail. lo0 filters do affect BFD, term order here is correct otherwise, and the filter belongs on lo0." },
      { id: "W32", domain: "POLICY",
        text: "How do the firewall-filter actions 'discard' and 'reject' differ?",
        options: [
          "Discard drops silently while reject can return an ICMP error",
          "Reject drops silently while discard returns an ICMP error message",
          "Discard logs each dropped packet while reject counts each dropped packet",
          "Both drop the packet silently but reject also mirrors it to an analyzer"
        ],
        answer: 0, multi: false,
        explanation: "Discard drops with no notification, while reject drops and can send an ICMP error such as administratively prohibited. Neither implies logging, counting, or mirroring by itself." },
      { id: "W33", domain: "POLICY",
        text: "A filter term reads 'then policer P; then accept', where policer P has a discard action for out-of-spec traffic. What happens to traffic that exceeds the policer profile?",
        options: [
          "The out-of-spec traffic is discarded while conforming traffic is accepted",
          "All traffic is accepted since the term ends with an accept action",
          "The out-of-spec traffic is queued until it conforms to the rate",
          "All traffic bypasses the policer under the terminating accept"
        ],
        answer: 0, multi: false,
        explanation: "The policer meters first: conforming traffic proceeds and is accepted, while out-of-spec traffic takes the policer's discard action. The trailing accept applies only to in-profile packets; policers drop rather than queue, and accept does not bypass the policer." },

      // ================= BGP (8) =================
      { id: "W34", domain: "BGP",
        text: "Referring to the exhibit, which path to 192.0.2.0/24 is selected as active?",
        exhibit:
"Path  Next-hop  AS-Path            Local-Pref  Origin  MED\n" +
"P1    reachable 65001 65002        100         IGP     50\n" +
"P2    reachable 65001              100         IGP     80\n" +
"P3    reachable 65001 65002 65003  100         IGP     10\n" +
"P4    unreachable 65001            100         IGP     0",
        options: [
          "P2",
          "P1",
          "P3",
          "P4"
        ],
        answer: 0, multi: false,
        explanation: "P4 is dropped first for an unresolved next hop. With local-pref tied at 100, the next test is shortest AS-path: P2 has one AS versus two or three for P1 and P3, so P2 wins before MED is ever compared." },
      { id: "W35", domain: "BGP",
        text: "An operator sets local-preference 200 on routes imported from an EBGP peer and expects that peer to send more inbound traffic. Why does inbound traffic not change?",
        options: [
          "Local preference is not advertised to EBGP peers",
          "Local preference must be applied as an export policy",
          "Local preference only influences IBGP-learned routes",
          "Local preference is overridden by the default MED"
        ],
        answer: 0, multi: false,
        explanation: "Local preference is significant only inside the local AS and is never sent to EBGP peers, so it cannot steer a neighbor's inbound choice. Influencing inbound traffic requires MED or AS-path prepending on advertisements to the peer." },
      { id: "W36", domain: "BGP",
        text: "Referring to the exhibit, why is the IBGP-learned route hidden as unusable?",
        exhibit:
"user@r1> show route 203.0.113.0/24 hidden detail\n" +
"  203.0.113.0/24 [BGP]\n" +
"    Next hop: 10.9.9.9\n" +
"user@r1> show route 10.9.9.9\n" +
"  (no entry)",
        options: [
          "The protocol next hop is not resolvable in the IGP",
          "The prefix falls within the martian range",
          "The route carries an unknown community",
          "The route lost the tie-break on router ID"
        ],
        answer: 0, multi: false,
        explanation: "A BGP route is hidden when its next hop cannot be resolved; 10.9.9.9 has no route, so the path is unusable. Fixing IGP reachability to that next hop, or using next-hop-self on the advertising router, resolves it. Martians, communities, and router-ID tie-breaks do not apply." },
      { id: "W37", domain: "BGP",
        text: "In a route-reflector topology, which attribute pair prevents loops among reflectors and clients?",
        options: [
          "Originator-ID and cluster-list",
          "AS-path and origin",
          "Local-preference and MED",
          "Community and aggregator"
        ],
        answer: 0, multi: false,
        explanation: "Reflected IBGP routes keep the same AS-path, so loop prevention uses the originator-ID (a router ignores routes carrying its own ID) and the cluster-list (a reflector drops routes already stamped with its cluster ID). The other attributes do not provide reflector loop protection." },
      { id: "W38", domain: "BGP",
        text: "You want a single upstream AS to prefer one of two EBGP links for traffic entering your AS, and that provider honors your metric. Which action achieves this?",
        options: [
          "Advertise a lower MED on the preferred link",
          "Advertise a higher local-preference to the provider",
          "Prepend your AS on the preferred link",
          "Set origin to Incomplete on the preferred link"
        ],
        answer: 0, multi: false,
        explanation: "MED is compared between paths from the same neighbor AS, so advertising a lower MED on the preferred link signals the provider which entrance to use. Local preference is never advertised, prepending would deter the link, and origin is a weaker, later tiebreaker." },
      { id: "W39", domain: "BGP",
        text: "Referring to the exhibit, a route is received with the AS-path shown. Why would the neighbor's operator have configured this?",
        exhibit:
"Received: 198.51.100.0/24  AS-path 65010 65010 65010 65020",
        options: [
          "To make the path less preferred for inbound traffic engineering",
          "To signal a routing loop that should be rejected",
          "To indicate the route physically transited 65010 three times",
          "To raise the local preference at each hop"
        ],
        answer: 0, multi: false,
        explanation: "Repeated leading AS numbers are AS-path prepending: 65010 lengthened the path so upstreams using AS-path length prefer other routes. It is not a loop, not three physical transits, and prepending does not alter local preference." },
      { id: "W40", domain: "BGP",
        text: "An EBGP session is configured toward the remote router's loopback rather than the connected interface, and it fails to establish. Which two are required to make it work? (Choose two.)",
        options: [
          "Configure EBGP multihop",
          "Provide a route to the peer's loopback address",
          "Enable a route reflector for the group",
          "Set the neighbor to passive mode"
        ],
        answer: [0, 1], multi: true,
        explanation: "Loopback EBGP means the TTL exceeds 1 and the peer is not the directly connected address, so multihop plus a route to the peer's loopback are both needed. Route reflection is an IBGP scaling tool, and passive mode does not address loopback reachability or TTL." },
      { id: "W41", domain: "BGP",
        text: "A BGP session repeatedly cycles between the Active and Connect states and never reaches Established. Which cause fits this behavior?",
        options: [
          "The TCP session to port 179 is not completing",
          "An import policy is rejecting the received routes",
          "The advertised AS-path is too long to accept",
          "The MED values differ between received paths"
        ],
        answer: 0, multi: false,
        explanation: "Cycling in Active/Connect means the underlying TCP session to port 179 is not establishing, typically due to an unreachable peer, a blocking filter, or a wrong neighbor/source address. Policy, AS-path, and MED issues only matter after the session is Established." },

      // ================= IS-IS (6) =================
      { id: "W42", domain: "ISIS",
        text: "Referring to the exhibit, the two routers form only a Level 2 adjacency, not Level 1. Why?",
        exhibit:
"R1  NET 49.0001.1921.6800.0001.00   level 1-2\n" +
"R2  NET 49.0002.1921.6800.0002.00   level 1-2",
        options: [
          "Their area addresses differ",
          "Their system identifiers differ",
          "Their NSEL values are both 00",
          "One router uses wide metrics"
        ],
        answer: 0, multi: false,
        explanation: "Level 1 requires a common area address; R1 is in 0001 and R2 in 0002, so only the area-independent Level 2 adjacency forms. System IDs are supposed to differ (must be unique), the NSEL of 00 is normal, and metric style does not gate adjacency level." },
      { id: "W43", domain: "ISIS",
        text: "On a broadcast IS-IS LAN, how is the DIS chosen and how does its behavior compare with an OSPF DR?",
        options: [
          "Highest priority then highest MAC wins, and the DIS is preemptable with no backup",
          "Lowest system ID wins, and a backup DIS is elected alongside it",
          "First router up wins, and it cannot be preempted",
          "Highest system ID wins, matching OSPF DR behavior exactly"
        ],
        answer: 0, multi: false,
        explanation: "The DIS is elected by highest priority, then highest MAC, and unlike OSPF there is no backup and a higher-priority router preempts it. The other options misstate the tiebreakers, backup behavior, or preemption." },
      { id: "W44", domain: "ISIS",
        text: "A router using wide metrics only does not exchange reachability correctly with an older router configured for narrow metrics. What is the underlying cause?",
        options: [
          "A metric-style mismatch changes which reachability TLVs are used",
          "The hello padding setting differs between the two neighboring routers",
          "One of the two routers has the IS-IS overload bit set on its LSP",
          "The area-address lengths encoded in the two NETs are different"
        ],
        answer: 0, multi: false,
        explanation: "Narrow and wide metrics use different reachability TLVs; if one router emits only wide-style TLVs and the other understands only narrow, they misinterpret each other's prefixes. Hello padding, the overload bit, and NET length are unrelated to this." },
      { id: "W45", domain: "ISIS",
        text: "After comparing databases on a point-to-point link, a router needs to request a specific missing LSP. Which PDU does it send?",
        options: [
          "A partial sequence number PDU",
          "A complete sequence number PDU",
          "An IS-IS hello PDU",
          "A purge of the missing LSP"
        ],
        answer: 0, multi: false,
        explanation: "A PSNP requests and acknowledges specific LSPs. A CSNP carries a full database summary, a hello forms adjacencies, and an LSP purge withdraws an LSP rather than requesting one." },
      { id: "W46", domain: "ISIS",
        text: "You configure an IS-IS backbone interface with 'level 1 disable'. What is the effect on that interface?",
        options: [
          "Only Level 2 adjacencies can form on it",
          "The interface stops sending any hellos",
          "The interface is forced to become the DIS",
          "Wide metrics are disabled on the interface"
        ],
        answer: 0, multi: false,
        explanation: "Disabling Level 1 restricts the interface to Level 2 operation, so only L2 adjacencies form there. It does not silence hellos, force the DIS role, or change the metric style." },
      { id: "W47", domain: "ISIS",
        text: "Referring to the exhibit, what does the flag shown for R5 signal to the rest of the IS-IS domain?",
        exhibit:
"user@r1> show isis database R5.00-00 extensive\n" +
"  R5.00-00  Sequence 0x21\n" +
"    LSP attributes: Overload",
        options: [
          "Avoid R5 as a transit path but keep reaching its connected prefixes",
          "R5 has failed and its link-state PDUs are being purged from the area",
          "R5 has been elected as the designated intermediate system for the LAN",
          "R5 is requesting a full synchronization of the link-state database"
        ],
        answer: 0, multi: false,
        explanation: "The overload bit tells other routers not to use R5 for transit while its own connected prefixes stay reachable. It does not indicate a failure/purge, DIS election, or a resync request." },

      // ================= PROTOCOL-INDEPENDENT ROUTING (5) =================
      { id: "W48", domain: "PIR",
        text: "Referring to the exhibit, two static routes to 10.8.0.0/16 are configured. Which next hop is active?",
        exhibit:
"routing-options static route 10.8.0.0/16 {\n" +
"    next-hop 172.16.1.2;\n" +
"    qualified-next-hop 172.16.9.2 { preference 20; }\n" +
"}",
        options: [
          "172.16.1.2",
          "172.16.9.2",
          "Both, load-shared",
          "Neither, the route is rejected"
        ],
        answer: 0, multi: false,
        explanation: "The primary next hop uses the default static preference of 5, while the qualified next hop is preference 20. Lower preference wins, so 172.16.1.2 is active and 172.16.9.2 is a standby used only if the primary becomes unusable." },
      { id: "W49", domain: "PIR",
        text: "An aggregate route for 10.0.0.0/8 is configured but is not active in the routing table. Which condition explains this?",
        options: [
          "No contributing more-specific route is present",
          "The aggregate has a preference higher than static",
          "Aggregate routes are only active in a VRF",
          "The aggregate needs an export policy to activate"
        ],
        answer: 0, multi: false,
        explanation: "An aggregate becomes active only when at least one contributing more-specific route exists. Preference value, instance type, and export policy do not control activation of the aggregate itself." },
      { id: "W50", domain: "PIR",
        text: "Traffic sourced from 192.168.50.0/24 must exit via a specific ISP regardless of the destination lookup in the main table. Which combination implements this?",
        options: [
          "A source-matching filter feeding a forwarding instance built by a rib-group",
          "An aggregate route paired with a generated route for the same destination",
          "A qualified-next-hop static default route pointing at the second ISP link",
          "A per-flow load-balancing policy applied under the forwarding-table export"
        ],
        answer: 0, multi: false,
        explanation: "Filter-based forwarding matches the source, directs it into a forwarding-type instance, and populates that instance's table via a rib-group. Aggregate/generated routes, a backup static default, and ECMP load balancing do not implement source-based forwarding." },
      { id: "W51", domain: "PIR",
        text: "Referring to the exhibit, how is traffic to 172.31.5.5 handled?",
        exhibit:
"user@r> show route 172.31.5.5\n" +
"172.31.0.0/16   *[Static/5]  Discard",
        options: [
          "It is dropped silently",
          "It is dropped and an ICMP unreachable is returned",
          "It is forwarded using the default route",
          "It is load-shared across available links"
        ],
        answer: 0, multi: false,
        explanation: "A discard next hop drops matching traffic silently with no ICMP. A reject next hop would return an ICMP unreachable; there is no fallback to a default or any load-sharing implied here." },
      { id: "W52", domain: "PIR",
        text: "A per-flow load-balancing policy is configured, yet only one next hop appears in the forwarding table. What was most likely omitted?",
        options: [
          "Exporting the policy under routing-options forwarding-table",
          "Adding the same policy as an OSPF import policy on the router",
          "Configuring a matching aggregate route for the destination prefix",
          "Enabling per-packet fragmentation on each of the egress interfaces"
        ],
        answer: 0, multi: false,
        explanation: "By default Junos installs a single next hop even with ECMP in the RIB; the balancing policy must be exported to the forwarding table to install multiple next hops. Import policy, aggregates, and fragmentation settings do not enable PFE load balancing." },

      // ================= HIGH AVAILABILITY / TUNNELS (8) =================
      { id: "W53", domain: "HA",
        text: "Referring to the exhibit, an ISSU was attempted but protocol sessions still dropped. Which prerequisite was missing?",
        exhibit:
"user@r> show system switchover\n" +
"  Graceful switchover: On\n" +
"  Nonstop-routing:     Off\n" +
"  Nonstop-bridging:    On",
        options: [
          "Nonstop active routing",
          "Graceful Routing Engine switchover",
          "Virtual Router Redundancy Protocol",
          "A second Routing Engine"
        ],
        answer: 0, multi: false,
        explanation: "The output shows graceful switchover on but nonstop-routing off. ISSU relies on NSR to preserve routing-protocol state during the upgrade, so without it the sessions flapped even though forwarding continued. GRES is already on, VRRP is unrelated, and a dual-RE chassis is implied by GRES being available." },
      { id: "W54", domain: "HA",
        text: "A Virtual Chassis is already formed and running when a member with a higher mastership priority is added. What happens to mastership by default?",
        options: [
          "The current master is kept and the new member becomes backup or linecard",
          "The new higher-priority member immediately preempts the running master",
          "The entire Virtual Chassis reboots to run a fresh mastership election",
          "Both members hold the master role together until the next planned reboot"
        ],
        answer: 0, multi: false,
        explanation: "Virtual Chassis mastership is non-preemptive by default, so a running master is not displaced merely because a higher-priority member joins later; the newcomer becomes backup or linecard. No reboot occurs and mastership is never shared." },
      { id: "W55", domain: "HA",
        text: "A VRRP master should relinquish mastership when its upstream link fails. Which capability provides this behavior?",
        options: [
          "Interface tracking that decrements the priority",
          "A shorter advertisement interval",
          "Disabling preempt on the master",
          "Matching the priority on both routers"
        ],
        answer: 0, multi: false,
        explanation: "VRRP interface (or route) tracking lowers the master's priority when the tracked uplink fails; once it falls below the backup, the backup takes over. Timer changes, disabling preempt, or equal priorities do not tie mastership to uplink health." },
      { id: "W56", domain: "HA",
        text: "Which two statements about BFD are correct? (Choose two.)",
        options: [
          "Its detection time is roughly the transmit interval times the multiplier",
          "It signals the routing protocol to converge faster on a failure",
          "It authenticates and encrypts the protocol it monitors",
          "It removes the need to run a routing protocol on the link"
        ],
        answer: [0, 1], multi: true,
        explanation: "BFD detection time is approximately interval times multiplier, and it triggers faster protocol reconvergence than native timers. It does not encrypt traffic and it complements rather than replaces a routing protocol." },
      { id: "W57", domain: "HA",
        text: "Referring to the exhibit, one member of ae0 is Detached. Which cause is most consistent with this state?",
        exhibit:
"user@sw> show lacp interfaces ae0\n" +
"  Aggregated interface: ae0\n" +
"    ge-0/0/0   Actor   Partner-state: Collecting Distributing\n" +
"    ge-0/0/1   Actor   Partner-state: Detached",
        options: [
          "The partner on ge-0/0/1 is not exchanging LACP",
          "The bundle has no IRB associated with it",
          "Storm control placed the member in the state",
          "The native VLAN on ae0 is misconfigured"
        ],
        answer: 0, multi: false,
        explanation: "A member stays Detached when LACP does not converge on that link, typically because the partner is not sending LACP or its parameters do not match. An IRB, storm control, and native-VLAN settings do not govern LACP member state." },
      { id: "W58", domain: "HA",
        text: "You must ensure traffic actually transits a GRE tunnel between two sites. Which two conditions are required? (Choose two.)",
        options: [
          "A route at each endpoint steering the traffic into the tunnel interface",
          "Underlay reachability between the tunnel source and destination addresses",
          "A route to the inner networks on every intermediate device",
          "An encryption profile applied to the tunnel"
        ],
        answer: [0, 1], multi: true,
        explanation: "The tunnel is used only when each end routes the intended traffic into the gr- interface and the underlay can reach the outer endpoint addresses. Intermediate routers forward only the outer packet and need not know the inner networks, and GRE does not require encryption to pass traffic." },
      { id: "W59", domain: "HA",
        text: "An OSPF adjacency formed over a GRE tunnel flaps whenever large database exchanges occur, while small packets pass fine. What is the underlying cause?",
        options: [
          "The tunnel MTU is too small for the encapsulated OSPF packets",
          "GRE keepalives are disabled on the tunnel",
          "OSPF is unsupported across a GRE tunnel",
          "The tunnel is placed in the wrong routing instance"
        ],
        answer: 0, multi: false,
        explanation: "GRE overhead lowers the effective MTU, so large OSPF exchanges exceed it and are dropped, destabilizing the adjacency, while small packets pass. Adjusting the tunnel or interface MTU resolves it; keepalives, protocol support, and instance placement are not the cause." },
      { id: "W60", domain: "HA",
        text: "How do nonstop bridging and nonstop active routing differ in what they preserve across a Routing Engine switchover?",
        options: [
          "NSB preserves Layer 2 state while NSR preserves Layer 3 routing state",
          "NSB preserves Layer 3 routing state while NSR preserves Layer 2 state",
          "Both preserve only forwarding-plane state and nothing else",
          "NSB works without GRES while NSR requires it"
        ],
        answer: 0, multi: false,
        explanation: "NSB keeps Layer 2 protocol and MAC state; NSR keeps Layer 3 routing-protocol state. Both build on GRES, and both preserve more than just the forwarding plane, so the other statements are incorrect." }
    ]
  };

  if (typeof ENT_CERT !== "undefined" && ENT_CERT && Array.isArray(ENT_CERT.exams)) {
    var idx = 0;
    for (var i = 0; i < ENT_CERT.exams.length; i++) { if (ENT_CERT.exams[i].id === "ENT-VOUCHER") { idx = i + 1; break; } }
    ENT_CERT.exams.splice(idx, 0, EXAM);
  }
  if (typeof module !== "undefined") { module.exports = { ENT_VOUCHER_EXAM_2: EXAM }; }
})();
