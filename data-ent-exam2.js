/*
 * JNCIS-ENT (JN0-352) — Full-length Voucher-Style Mock Exam #2 (HARD).
 * 60 questions, 90-minute fixed clock (timeLimitSec: 5400).
 *
 * Tougher/trickier than the first voucher exam: more exhibit interpretation,
 * multi-step reasoning, subtle distractors, edge cases, and "choose two".
 *
 * Weighting (weak-area heavy): STP 9, OSPF 10, L2 switching 7, L2 security/filters 7,
 * BGP 8, IS-IS 6, PIR 5, HA/tunnels 8 = 60.
 *
 * Rules applied: no repeats of any existing ENT question; correct-answer length
 * decoupled from correctness; exhibits use q.exhibit. data.js balances A/B/C/D positions.
 *
 * Appends to the FRONT of ENT_CERT.exams (after the first voucher, still near the top).
 */
(function () {
  var EXAM = {
    id: "ENT-VOUCHER-2",
    name: "★ Full Mock 2 — 60 Q / 90 min (Hard)",
    description: "Second full-length exam — harder and trickier: heavy exhibit interpretation, multi-step reasoning, and edge-case distractors. 60 questions, 90-minute clock.",
    timeLimitSec: 5400,
    questions: [
      // ================= SPANNING TREE (9) =================
      { id: "W1", domain: "STP",
        text: "Referring to the exhibit, SW1 and SW2 both claim to be the root bridge for the instance. All links are up. What is the most likely cause?",
        exhibit:
"SW1> show spanning-tree bridge\n" +
"  Root ID           : 4096.00:1f:aa:11:11:11  (this bridge is root)\n" +
"  Bridge priority   : 4096\n" +
"SW2> show spanning-tree bridge\n" +
"  Root ID           : 4096.00:1f:bb:22:22:22  (this bridge is root)\n" +
"  Bridge priority   : 4096\n" +
"SW1<->SW2 link: ge-0/0/0 (VSTP VLAN 10 on SW1, MSTP on SW2)",
        options: [
          "The two switches run different spanning-tree protocols on the link, so they do not exchange compatible BPDUs and each stays root",
          "The bridge priorities are equal, which is unsupported",
          "MACsec is dropping the BPDUs",
          "The link cost is set too high on both sides"
        ],
        answer: 0, multi: false,
        explanation: "SW1 runs VSTP (per-VLAN) and SW2 runs MSTP on the shared link. Because the protocols/BPDU formats are not compatible for that instance, neither accepts the other's superior BPDU and each remains root of its own tree — a classic mixed-mode misconfiguration. Equal priorities are legal (MAC breaks the tie)." },
      { id: "W2", domain: "STP",
        text: "In RSTP, a designated port on a point-to-point link transitions to forwarding quickly using which mechanism, rather than waiting for a timer?",
        options: [
          "The proposal/agreement handshake with its peer",
          "The max-age timer expiring",
          "TCN flooding to the root",
          "Doubling its path cost"
        ],
        answer: 0, multi: false,
        explanation: "RSTP uses a proposal/agreement (sync) handshake on point-to-point links so a designated port can move to forwarding immediately once the neighbor agrees, avoiding the legacy 802.1D listening/learning timers." },
      { id: "W3", domain: "STP",
        text: "Referring to the exhibit, a topology change is detected. In RSTP, what does a switch do with the MAC addresses learned on ports NOT involved in the change?",
        exhibit:
"Event: RSTP topology change received on ge-0/0/1\n" +
"Non-edge ports: ge-0/0/1 (root), ge-0/0/2 (designated)",
        options: [
          "It immediately flushes those MAC entries as well, to be safe",
          "It flushes MAC entries on all ports except the port that received the change and edge ports",
          "It keeps all MAC entries and simply ages them normally",
          "It sets the MAC aging timer to 15 seconds globally"
        ],
        answer: 1, multi: false,
        explanation: "In RSTP, on a topology change a bridge flushes the MAC addresses learned on all non-edge ports EXCEPT the port on which the change was received. This rapid flush (rather than relying on slow aging like 802.1D) is a key reason RSTP reconverges faster." },
      { id: "W4", domain: "STP",
        text: "A port configured with BPDU protect was error-disabled. Which condition allows it to return to service automatically without manual intervention?",
        options: [
          "A configured disable-timeout expiring",
          "The next hello interval",
          "A change in root bridge priority",
          "Clearing the MAC table"
        ],
        answer: 0, multi: false,
        explanation: "A BPDU-protected port that is disabled recovers manually (clear) or automatically only if a 'disable-timeout' is configured; when that timer expires the port is re-enabled. Nothing about hellos, priority, or MAC-table clearing revives it." },
      { id: "W5", domain: "STP",
        text: "Two switches connect with two parallel links in the same VLAN and no LAG. Which RSTP port role is assigned to the second link's port on the non-root switch?",
        options: [
          "Root port",
          "Designated port",
          "Alternate port",
          "Backup port"
        ],
        answer: 2, multi: false,
        explanation: "On the non-root switch, one port becomes the root port and the redundant parallel port toward the root becomes an alternate port (blocking, standby path to the root). A backup port applies to redundancy toward the SAME segment served by a designated port on the same bridge — not this case." },
      { id: "W6", domain: "STP",
        text: "You set 'set protocols rstp interface ge-0/0/5 edge' and 'no-root-port'. A superior BPDU arrives on ge-0/0/5. Assuming root guard behavior via that constraint, what is the resulting port state?",
        options: [
          "root-inconsistent (blocking) until the superior BPDUs stop",
          "forwarding as the new root port",
          "listening indefinitely",
          "administratively down"
        ],
        answer: 0, multi: false,
        explanation: "Root-guard-style behavior places a port that receives a superior BPDU into a root-inconsistent (blocking) state; it recovers to normal forwarding automatically once the superior BPDUs cease. It is not administratively shut like a BPDU-protect port." },
      { id: "W7", domain: "STP",
        text: "Referring to the exhibit, which port becomes the root port on SW-X?",
        exhibit:
"Root bridge is reachable via two paths from SW-X:\n" +
"  Path A: ge-0/0/1 -> SW-Y -> root   (SW-X cost 20000 + advertised 20000)\n" +
"  Path B: ge-0/0/2 -> SW-Z -> root   (SW-X cost 20000 + advertised 0)\n" +
"SW-Y sender bridge ID lower than SW-Z? No: SW-Z has the lower bridge ID.",
        options: [
          "ge-0/0/1, because it uses SW-Y",
          "ge-0/0/2, because the total root path cost is lower",
          "Neither; both block",
          "ge-0/0/1, because it has the lower port number"
        ],
        answer: 1, multi: false,
        explanation: "Root-port selection first compares the lowest cumulative root path cost. Path B totals 20000 (20000+0) versus Path A's 40000 (20000+20000), so ge-0/0/2 wins on cost before sender bridge ID or port ID are ever considered." },
      { id: "W8", domain: "STP",
        text: "Which two statements about RSTP edge ports are correct? (Choose two.)",
        options: [
          "An edge port transitions directly to forwarding without the listening/learning delay",
          "Receiving a BPDU on an edge port causes it to lose edge status and behave as a normal spanning-tree port",
          "Edge ports generate topology change notifications when a host connects",
          "Edge ports are always the root port"
        ],
        answer: [0, 1], multi: true,
        explanation: "Edge ports skip the transition delay and go straight to forwarding; if a BPDU is ever received, the port stops being an edge port and reverts to normal STP operation (this is why BPDU protect is often paired with it). Edge ports do NOT trigger topology changes on host connect, and they are never inherently the root port." },
      { id: "W9", domain: "STP",
        text: "In MSTP, what is the role of the CST/IST (internal spanning tree) with respect to regions?",
        options: [
          "It presents each MST region to the rest of the network as a single logical bridge",
          "It runs a separate instance per VLAN inside the region",
          "It disables spanning tree between regions",
          "It replaces RSTP on edge ports"
        ],
        answer: 0, multi: false,
        explanation: "MSTP's IST/CST makes an entire MST region appear as one logical bridge to switches outside the region (including non-MSTP RSTP bridges), so inter-region topology is loop-free while MSTIs map VLAN groups inside the region." },

      // ================= OSPF (10) =================
      { id: "W10", domain: "OSPF",
        text: "Referring to the exhibit, the neighbor is stuck. Given the two Hellos, what is the exact cause?",
        exhibit:
"OSPF sent Hello 10.1.1.1 -> 224.0.0.5 (ge-0/0/0.0 area 0.0.0.0)\n" +
"  hello_ivl 10, dead_ivl 40, mask 255.255.255.0\n" +
"OSPF rcvd Hello 10.1.1.2 -> 224.0.0.5 (ge-0/0/0.0 area 0.0.0.0)\n" +
"  hello_ivl 10, dead_ivl 40, mask 255.255.255.252",
        options: [
          "Hello interval mismatch",
          "Subnet mask mismatch on the shared segment",
          "Area mismatch",
          "Authentication type mismatch"
        ],
        answer: 1, multi: false,
        explanation: "Hello/dead intervals (10/40) and area (0.0.0.0) match, but the masks differ: 255.255.255.0 (/24) versus 255.255.255.252 (/30). On broadcast/point-to-point OSPF the subnets must match, so the mismatch prevents the adjacency. Nothing in the trace indicates authentication." },
      { id: "W11", domain: "OSPF",
        text: "An ABR connects area 0 and a totally stubby area. Which LSA(s) does it inject INTO the totally stubby area?",
        options: [
          "Only a single Type 3 default route",
          "Type 3 summaries for every inter-area prefix",
          "Type 5 external LSAs",
          "Type 7 NSSA LSAs"
        ],
        answer: 0, multi: false,
        explanation: "Into a totally stubby area the ABR suppresses specific Type 3 summaries and all Type 4/5, injecting just one Type 3 default route. Type 5 are blocked in any stub variant; Type 7 exist only in an NSSA." },
      { id: "W12", domain: "OSPF",
        text: "Referring to the exhibit, why does R1 not install the 10.20.20.0/24 external route even though the LSA is in its database?",
        exhibit:
"R1> show ospf database external\n" +
"  Type  ID           Adv Rtr    Age  ...\n" +
"  Extern 10.20.20.0  10.0.0.9   210\n" +
"R1> show ospf database | match 10.0.0.9\n" +
"  (no Router/Network LSA reachability to 10.0.0.9 found)",
        options: [
          "The external LSA is too old",
          "The ASBR (10.0.0.9) that originated it is not reachable in the OSPF topology, so the route cannot be installed",
          "External routes are never installed by default",
          "R1 is in a stub area"
        ],
        answer: 1, multi: false,
        explanation: "For an OSPF external (Type 5) route to be installed, the advertising ASBR must be reachable via intra/inter-area routes (a Type 4 or router reachability). The exhibit shows no reachability to 10.0.0.9, so SPF cannot resolve the external's forwarding and the route is not installed." },
      { id: "W13", domain: "OSPF",
        text: "You raise an interface's OSPF metric with 'set protocols ospf area 0 interface ge-0/0/1 metric 500'. What does this override?",
        options: [
          "Only the cost of that specific interface, ignoring the reference-bandwidth calculation",
          "The reference bandwidth for the whole router",
          "The dead interval on that interface",
          "The Router ID"
        ],
        answer: 0, multi: false,
        explanation: "An explicit interface 'metric' statement sets that interface's OSPF cost directly, overriding the value the reference-bandwidth formula would otherwise compute. It does not affect reference bandwidth, timers, or the Router ID." },
      { id: "W14", domain: "OSPF",
        text: "Which OSPF LSA is originated by the DR to represent a multi-access segment and list the routers attached to it?",
        options: [
          "Type 1 Router LSA",
          "Type 2 Network LSA",
          "Type 3 Summary LSA",
          "Type 4 ASBR-Summary LSA"
        ],
        answer: 1, multi: false,
        explanation: "The DR originates the Type 2 Network LSA describing the multi-access (broadcast/NBMA) segment and the routers on it. Type 1 describes a router's own links; Type 3/4 are ABR-originated inter-area LSAs." },
      { id: "W15", domain: "OSPF",
        text: "Referring to the exhibit, two routers are Full but R1 is not learning R2's loopback 10.2.2.2/32. What is the most likely reason?",
        exhibit:
"R2 config:\n" +
"  protocols ospf area 0.0.0.0 interface ge-0/0/0.0;\n" +
"  interfaces lo0 unit 0 family inet address 10.2.2.2/32;\n" +
"  (lo0 is NOT listed under protocols ospf)",
        options: [
          "The loopback is not enabled under OSPF, so it is not advertised",
          "OSPF never advertises loopbacks",
          "The area must be a stub",
          "R1 needs an export policy"
        ],
        answer: 0, multi: false,
        explanation: "OSPF only advertises interfaces configured under the OSPF protocol. R2's lo0 is not listed under 'protocols ospf', so 10.2.2.2/32 is never originated. Adding lo0 to the OSPF area (typically passive) advertises it." },
      { id: "W16", domain: "OSPF",
        text: "What is the default OSPF interface priority on a Junos broadcast interface, and what does setting it to 0 do?",
        options: [
          "128; setting 0 makes the interface ineligible to become DR or BDR",
          "1; setting 0 forces it to become DR",
          "0; setting 0 has no effect",
          "255; setting 0 disables OSPF on the interface"
        ],
        answer: 0, multi: false,
        explanation: "The default OSPF interface priority in Junos is 128. A priority of 0 makes the interface ineligible for DR/BDR election (it can still form adjacencies with the DR/BDR). It does not disable OSPF." },
      { id: "W17", domain: "OSPF",
        text: "A summary LSA for 10.0.0.0/8 and a more-specific intra-area route for 10.1.0.0/16 both exist for a destination 10.1.2.3. Which is used to forward, and why?",
        options: [
          "The 10.1.0.0/16 route, because forwarding uses the longest prefix match",
          "The 10.0.0.0/8 summary, because summaries win",
          "Whichever has the lower OSPF cost regardless of prefix length",
          "Neither; OSPF cannot have overlapping prefixes"
        ],
        answer: 0, multi: false,
        explanation: "Forwarding always chooses the longest (most specific) matching prefix. 10.1.0.0/16 is more specific than 10.0.0.0/8 for 10.1.2.3, so it is used regardless of cost or LSA type. Cost only compares routes to the identical prefix." },
      { id: "W18", domain: "OSPF",
        text: "Which two conditions are required for two OSPF routers to become neighbors (reach 2-Way)? (Choose two.)",
        options: [
          "Matching Hello and Dead intervals",
          "Matching area ID on the shared link",
          "Matching Router IDs",
          "Matching reference bandwidth"
        ],
        answer: [0, 1], multi: true,
        explanation: "To reach 2-Way, the Hello/Dead timers and the area ID (plus subnet/mask, auth, and stub flags) must match. Router IDs must be UNIQUE (not matching), and reference bandwidth is locally significant and not exchanged." },
      { id: "W19", domain: "OSPF",
        text: "You want an OSPF router to advertise a loopback but never form an adjacency out of it. Which configuration achieves this?",
        options: [
          "Configure the interface as passive under OSPF",
          "Set its metric to 0",
          "Put it in a stub area",
          "Disable the loopback"
        ],
        answer: 0, multi: false,
        explanation: "A passive OSPF interface is advertised into OSPF (its subnet appears in the LSDB) but sends/accepts no Hellos, so no adjacency forms — exactly what you want for a loopback or a LAN with no OSPF neighbors." },

      // ================= LAYER 2 SWITCHING / VLANs (7) =================
      { id: "W20", domain: "L2",
        text: "Referring to the exhibit, a host in VLAN 30 on SW-A cannot reach a host in VLAN 30 on SW-B. The trunk is up. What is the fix?",
        exhibit:
"SW-A ge-0/0/24 (trunk): vlan members [ 10 20 ]\n" +
"SW-B ge-0/0/24 (trunk): vlan members [ 10 20 30 ]\n" +
"Both hosts are in VLAN 30 access ports.",
        options: [
          "Add VLAN 30 to the trunk member list on SW-A",
          "Create an IRB for VLAN 30 on both switches",
          "Change the hosts to the native VLAN",
          "Enable MVRP only on SW-B"
        ],
        answer: 0, multi: false,
        explanation: "SW-A's trunk does not carry VLAN 30, so VLAN 30 frames never cross to SW-B. Adding VLAN 30 to SW-A's trunk 'vlan members' restores same-VLAN reachability. An IRB is only for inter-VLAN routing, not same-VLAN transport." },
      { id: "W21", domain: "L2",
        text: "On an ELS switch, a trunk is configured with 'native-vlan-id 99' but VLAN 99 is not in the interface's vlan members list. What happens to untagged frames received on the trunk?",
        options: [
          "They are dropped because VLAN 99 is not a member of the trunk",
          "They are tagged with VLAN 1",
          "They are flooded to all VLANs",
          "They are routed by the nearest IRB"
        ],
        answer: 0, multi: false,
        explanation: "For untagged frames to be accepted into the native VLAN, that VLAN must also be a member of the trunk. If native-vlan-id 99 is set but VLAN 99 is not in the members list, untagged frames are dropped — a common, subtle misconfiguration." },
      { id: "W22", domain: "L2",
        text: "Which statement accurately describes how a Junos switch handles a frame whose destination MAC is not in the Ethernet switching table?",
        options: [
          "It floods the frame out all ports in the same VLAN except the one it arrived on",
          "It drops the frame",
          "It sends the frame to the Routing Engine",
          "It forwards it only to the trunk ports"
        ],
        answer: 0, multi: false,
        explanation: "An unknown-unicast frame is flooded to all ports in the frame's VLAN except the ingress port. Once the destination replies, its MAC is learned and future frames are unicast. It is not dropped or punted to the RE." },
      { id: "W23", domain: "L2",
        text: "Referring to the exhibit, what does 'show ethernet-switching table' tell you about MAC 00:05:aa:bb:cc:dd?",
        exhibit:
"VLAN   MAC address        Type      Interface\n" +
"v10    00:05:aa:bb:cc:dd  Static    ge-0/0/3.0\n" +
"v10    00:05:11:22:33:44  Dynamic   ge-0/0/4.0",
        options: [
          "It was configured/pinned as a static MAC on ge-0/0/3 and will not age out",
          "It was learned dynamically and will age out in 300 s",
          "It is a multicast address",
          "It is blocked by storm control"
        ],
        answer: 0, multi: false,
        explanation: "A 'Static' type entry is administratively configured (pinned) to an interface and does not age out, unlike the 'Dynamic' entry that ages after the default 300 s of inactivity." },
      { id: "W24", domain: "L2",
        text: "A voice VLAN is configured on an access port for IP phones. How does the phone typically learn which VLAN ID to tag its voice traffic with?",
        options: [
          "Via LLDP-MED advertised by the switch",
          "By running STP",
          "From the DHCP snooping table",
          "By flooding until it guesses"
        ],
        answer: 0, multi: false,
        explanation: "LLDP-MED lets the switch advertise the voice VLAN ID (and QoS) to the phone, which then tags its voice traffic accordingly while the PC behind it stays untagged in the data VLAN. STP/DHCP snooping do not convey the voice VLAN." },
      { id: "W25", domain: "L2",
        text: "You must prevent a specific server's MAC from ever moving to another port (MAC move / spoofing). Which approach is most appropriate?",
        options: [
          "Configure a static MAC entry (and/or persistent MAC / MAC move limiting) for that address",
          "Enable storm control",
          "Increase the MAC aging timer",
          "Apply root guard"
        ],
        answer: 0, multi: false,
        explanation: "Pinning the MAC as a static entry (optionally with persistent MAC learning or MAC-move limiting) keeps it bound to the intended port and prevents it being relearned elsewhere. Storm control, aging, and root guard address unrelated problems." },
      { id: "W26", domain: "L2",
        text: "In a Q-in-Q-free enterprise, what is the maximum number of usable VLANs on a single trunk, and which field imposes this?",
        options: [
          "4094, imposed by the 12-bit 802.1Q VLAN ID field",
          "1024, imposed by the priority field",
          "65535, imposed by the EtherType",
          "256, imposed by the MAC table"
        ],
        answer: 0, multi: false,
        explanation: "The 802.1Q VLAN ID is a 12-bit field (0–4095), with 0 and 4095 reserved, leaving 1–4094 usable. To exceed this in a provider design you would use Q-in-Q (out of scope here)." },

      // ================= LAYER 2 SECURITY + FILTERS (7) =================
      { id: "W27", domain: "L2",
        text: "Referring to the exhibit, DAI is enabled on VLAN 10. A client on an untrusted access port sends an ARP claiming 10.10.10.50 is at its MAC, but the binding table shows a different port for that IP. What does the switch do?",
        exhibit:
"DHCP snooping binding (VLAN 10):\n" +
"  IP 10.10.10.50  MAC 00:aa:00:00:00:07  Interface ge-0/0/9.0\n" +
"ARP received on ge-0/0/12.0: sender 10.10.10.50 / 00:bb:bb:bb:bb:bb",
        options: [
          "It discards the ARP because it does not match a valid binding, preventing ARP spoofing",
          "It updates the binding to the new port",
          "It floods the ARP to all ports",
          "It forwards the ARP but logs a warning only"
        ],
        answer: 0, multi: false,
        explanation: "Dynamic ARP inspection validates ARPs on untrusted ports against the DHCP snooping bindings; this ARP claims an IP/MAC/port combination that does not match the binding, so it is discarded — exactly the ARP-spoofing/man-in-the-middle protection DAI provides." },
      { id: "W28", domain: "L2",
        text: "IP source guard is enabled on an access port. A statically addressed host (no DHCP) is connected and loses connectivity. Why, and what is the fix?",
        options: [
          "No DHCP binding exists for its source IP, so its traffic is dropped; add a static IP-source-guard binding (or exclude the port)",
          "IP source guard requires MACsec; enable it",
          "The port must be a trunk; convert it",
          "Storm control is discarding the traffic; raise the level"
        ],
        answer: 0, multi: false,
        explanation: "IP source guard permits only source IP/MAC that match a DHCP snooping binding. A static host has no binding, so its data is dropped. Adding a static binding for that IP/MAC (or exempting the port) restores connectivity — a common gotcha with statically addressed devices." },
      { id: "W29", domain: "L2",
        text: "Which two attacks are directly mitigated by DHCP snooping? (Choose two.)",
        options: [
          "A rogue DHCP server handing out incorrect gateways",
          "DHCP starvation building a foundation for exhaustion (in concert with rate limiting)",
          "OSPF adjacency spoofing",
          "BGP route hijacking"
        ],
        answer: [0, 1], multi: true,
        explanation: "DHCP snooping blocks rogue DHCP servers on untrusted ports and, with DHCP rate limiting, helps counter DHCP starvation attacks. OSPF/BGP control-plane attacks are unrelated and are addressed by protocol authentication and RE-protection filters." },
      { id: "W30", domain: "POLICY",
        text: "Referring to the exhibit, an ethernet-switching filter is applied to VLAN 10. Frame with source MAC 00:de:ad:be:ef:01 and destination TCP 23 arrives. What is the outcome?",
        exhibit:
"filter L2 {\n" +
"  term t1 { from { source-mac-address 00:de:ad:be:ef:01/48; } then accept; }\n" +
"  term t2 { from { destination-port telnet; } then discard; }\n" +
"  term t3 { then accept; }\n" +
"}",
        options: [
          "Accepted by term t1 (first match wins)",
          "Discarded by term t2",
          "Accepted by term t3",
          "Both counted and discarded"
        ],
        answer: 0, multi: false,
        explanation: "Firewall filters stop at the first matching term with a terminating action. Term t1 matches the source MAC and accepts, so evaluation stops there — term t2's telnet-discard is never reached for this frame. Order matters." },
      { id: "W31", domain: "POLICY",
        text: "You apply a firewall filter on the loopback (lo0) permitting SSH, BGP, and ICMP, ending with 'then discard'. After commit, BFD sessions to neighbors fail. What is the cause?",
        options: [
          "The filter discards BFD control packets because no term permits them",
          "lo0 filters cannot affect BFD",
          "BFD requires MACsec",
          "The discard term must be first"
        ],
        answer: 0, multi: false,
        explanation: "An lo0 (control-plane) filter drops anything not explicitly permitted before the terminating discard. BFD control traffic destined to the RE is not permitted, so it is dropped and sessions fail. Add a term permitting BFD (and other required control protocols)." },
      { id: "W32", domain: "POLICY",
        text: "Which statement about the difference between a firewall filter 'discard' and 'reject' action is correct?",
        options: [
          "discard drops silently; reject drops and may return an ICMP error to the sender",
          "They are identical",
          "reject drops silently; discard returns ICMP",
          "discard forwards to the RE; reject forwards to the PFE"
        ],
        answer: 0, multi: false,
        explanation: "In firewall filters, 'discard' silently drops the packet with no notification, while 'reject' drops it and can send an ICMP error (e.g., administratively prohibited) back to the source." },
      { id: "W33", domain: "POLICY",
        text: "A policer is configured with bandwidth-limit 10m and burst-size-limit 15k, referenced by a filter term with 'then policer P; then accept'. What happens to traffic exceeding the profile?",
        options: [
          "The policer's own out-of-spec action (e.g., discard) applies to the excess; conforming traffic is accepted",
          "All traffic is accepted regardless",
          "All traffic is discarded",
          "The term is ignored because you cannot combine policer and accept"
        ],
        answer: 0, multi: false,
        explanation: "The policer meters traffic: conforming traffic proceeds (and is accepted), while out-of-spec traffic gets the policer's configured action (commonly discard, or a loss-priority/DSCP marking). Combining 'then policer' with 'then accept' is valid — the policer acts first on non-conforming packets." },

      // ================= BGP (8) =================
      { id: "W34", domain: "BGP",
        text: "Referring to the exhibit, which route to 192.0.2.0/24 is selected as active?",
        exhibit:
"Path  Next-hop-reachable  AS-Path            Local-Pref  Origin  MED\n" +
"P1    yes                 65001 65002        100         IGP     50\n" +
"P2    yes                 65001              100         IGP     80\n" +
"P3    yes                 65001 65002 65003  100         IGP     10\n" +
"P4    no                  65001              100         IGP     0",
        options: [
          "P2, because with equal local-pref it has the shortest AS-path",
          "P4, because it has the lowest MED",
          "P3, because it has the longest AS-path",
          "P1, because it was received first"
        ],
        answer: 0, multi: false,
        explanation: "P4 is eliminated first (next hop unreachable). Among the rest, local-pref ties at 100, so the next criterion is shortest AS-path: P2 (65001) beats P1 and P3. MED is only compared later and only among paths from the same neighboring AS, so it never decides here." },
      { id: "W35", domain: "BGP",
        text: "You apply an import policy that sets local-preference 200 on routes from a specific EBGP peer. A colleague expected this to influence how that peer sends traffic to you. Why will it not?",
        options: [
          "Local preference is only significant within your own AS and is never advertised to EBGP peers",
          "Local preference must be set on export, not import",
          "The peer must also raise its MED",
          "Local preference only affects IPv6"
        ],
        answer: 0, multi: false,
        explanation: "Local preference influences YOUR AS's outbound path choice and is shared only via IBGP inside your AS — it is never sent to EBGP peers. To influence a neighbor's inbound decision you would use MED or AS-path prepending on advertisements to them." },
      { id: "W36", domain: "BGP",
        text: "Referring to the exhibit, why is the IBGP-learned route hidden with 'unusable route'?",
        exhibit:
"user@r1> show route 203.0.113.0/24 hidden detail\n" +
"  203.0.113.0/24 [BGP] ... \n" +
"    Next hop: 10.9.9.9 (unusable)\n" +
"  user@r1> show route 10.9.9.9\n" +
"    (no route to 10.9.9.9)",
        options: [
          "The BGP next hop 10.9.9.9 is not resolvable via the IGP, so the route is unusable",
          "The prefix is a martian",
          "The route has no community",
          "IBGP routes are always hidden"
        ],
        answer: 0, multi: false,
        explanation: "A BGP route is hidden/unusable when its next hop cannot be resolved. Here 10.9.9.9 has no IGP route, so the next hop is unusable. Fixing IGP reachability to 10.9.9.9 (or using next-hop self on the advertising router) resolves it." },
      { id: "W37", domain: "BGP",
        text: "In a route-reflector design, which attribute pair prevents routing loops among reflectors and clients?",
        options: [
          "ORIGINATOR_ID and CLUSTER_LIST",
          "MED and Local-Pref",
          "AS-path and Origin",
          "Community and Aggregator"
        ],
        answer: 0, multi: false,
        explanation: "Because reflected IBGP routes keep the same AS-path, loop prevention uses ORIGINATOR_ID (the router that first injected the route — it ignores routes with its own ID) and CLUSTER_LIST (a reflector drops a route whose cluster list already contains its cluster ID)." },
      { id: "W38", domain: "BGP",
        text: "You want inbound traffic to prefer one of two EBGP links to the SAME provider AS. The provider honors MED. Which action achieves this?",
        options: [
          "Advertise a lower MED on the preferred link",
          "Advertise a higher local preference to the provider",
          "Prepend your AS on the preferred link",
          "Set origin to Incomplete on the preferred link"
        ],
        answer: 0, multi: false,
        explanation: "MED is compared between paths from the same neighboring AS; advertising a lower MED on the preferred link tells that provider which entry point to prefer for inbound traffic. Local pref is not sent to peers, and prepending would make a link LESS preferred." },
      { id: "W39", domain: "BGP",
        text: "Referring to the exhibit, a route is received with AS-path '65010 65010 65010 65020'. Why might an operator have configured this?",
        exhibit:
"Received: 198.51.100.0/24  AS-path 65010 65010 65010 65020",
        options: [
          "AS 65010 prepended its own AS to make this path less preferred for inbound traffic engineering",
          "It indicates a routing loop that will be rejected",
          "It shows the route traversed 65010 three separate times physically",
          "It increases the local preference"
        ],
        answer: 0, multi: false,
        explanation: "Repeated leading AS numbers indicate AS-path prepending — AS 65010 added itself multiple times to lengthen the path so that this route is less preferred by upstreams that use AS-path length, a common inbound traffic-engineering technique. It is not a loop." },
      { id: "W40", domain: "BGP",
        text: "Two EBGP peers are directly connected on ge-0/0/0, but you configured the neighbor as the remote router's loopback. The session fails. Which two are required to fix it? (Choose two.)",
        options: [
          "Configure EBGP multihop",
          "Ensure a route exists to the peer's loopback",
          "Enable route reflection",
          "Change the peer to passive"
        ],
        answer: [0, 1], multi: true,
        explanation: "Peering to a loopback means the TTL exceeds 1 and the destination is not the directly connected interface, so you need 'multihop' AND a route to the peer's loopback (e.g., a static or IGP route). Route reflection and passive mode do not address loopback EBGP." },
      { id: "W41", domain: "BGP",
        text: "A BGP session repeatedly cycles through Active/Connect and never reaches Established. Which cause is most consistent with that symptom?",
        options: [
          "TCP to port 179 is not completing (unreachable peer, filter, or wrong neighbor address)",
          "An export policy is rejecting routes",
          "The AS-path is too long",
          "MED is misconfigured"
        ],
        answer: 0, multi: false,
        explanation: "Cycling in Active/Connect means the underlying TCP session to port 179 is not establishing — typically the peer address is unreachable, a firewall filter blocks TCP 179, or the neighbor/source addressing is wrong. Policy/attribute issues only matter after the session is Established." },

      // ================= IS-IS (6) =================
      { id: "W42", domain: "ISIS",
        text: "Referring to the exhibit, why will these two routers NOT form an IS-IS Level 1 adjacency?",
        exhibit:
"R1 NET: 49.0001.1921.6800.0001.00  (level 1-2)\n" +
"R2 NET: 49.0002.1921.6800.0002.00  (level 1-2)",
        options: [
          "Their area addresses differ (0001 vs 0002), and L1 requires the same area",
          "Their system IDs differ",
          "Both are level 1-2",
          "The NSEL is 00"
        ],
        answer: 0, multi: false,
        explanation: "A Level 1 adjacency requires a common area address; R1 is in area 0001 and R2 in area 0002, so no L1 adjacency forms. They could still form a Level 2 adjacency (which ignores area). Differing system IDs are required (must be unique), not a problem." },
      { id: "W43", domain: "ISIS",
        text: "On a broadcast IS-IS LAN, how is the DIS elected, and how does its behavior differ from an OSPF DR?",
        options: [
          "Highest priority then highest MAC wins; unlike OSPF there is no backup DIS and the DIS can be preempted",
          "Lowest system ID wins; a backup DIS is always elected",
          "First router up wins; it cannot be preempted",
          "Highest Router ID wins; identical to OSPF"
        ],
        answer: 0, multi: false,
        explanation: "The DIS is elected by highest interface priority, then highest MAC (SNPA). Unlike OSPF's DR/BDR, IS-IS has no backup DIS and the DIS is preemptable — a higher-priority router taking over causes a brief pseudonode change." },
      { id: "W44", domain: "ISIS",
        text: "An IS-IS router should carry IPv4 reachability but you notice a neighbor with wide-metrics-only is not exchanging routes with an old device using narrow metrics. What is the underlying issue?",
        options: [
          "A metric-style (narrow vs wide) mismatch prevents proper reachability exchange",
          "Their hello timers differ",
          "One uses OSPF",
          "The NET lengths differ"
        ],
        answer: 0, multi: false,
        explanation: "IS-IS reachability is carried in metric-style-specific TLVs. If one router advertises only wide-metric TLVs and the other understands only narrow, they do not interpret each other's reachability correctly. A transition (both) or matching metric style resolves it." },
      { id: "W45", domain: "ISIS",
        text: "Which IS-IS PDU does a router use on a point-to-point link to explicitly request a missing LSP after comparing databases?",
        options: [
          "PSNP (Partial Sequence Number PDU)",
          "CSNP (Complete Sequence Number PDU)",
          "IIH (IS-IS Hello)",
          "LSP itself"
        ],
        answer: 0, multi: false,
        explanation: "A PSNP requests (and acknowledges) specific LSPs. A CSNP carries a complete summary of the LSP database (periodic on LANs, once at P2P startup); IIH forms adjacencies; the LSP is the link-state advertisement itself." },
      { id: "W46", domain: "ISIS",
        text: "You configure an IS-IS interface as 'level 1 disable'. What is the effect on that interface?",
        options: [
          "Only Level 2 adjacencies can form on it",
          "The interface is shut down",
          "It becomes the DIS automatically",
          "It disables wide metrics"
        ],
        answer: 0, multi: false,
        explanation: "Disabling level 1 on an interface restricts it to Level 2 operation, so only L2 adjacencies form there — useful to keep backbone links purely L2. It does not shut the interface or affect DIS/metrics directly." },
      { id: "W47", domain: "ISIS",
        text: "Referring to the exhibit, what does the 'Overload' flag on R5 indicate to the rest of the IS-IS domain?",
        exhibit:
"user@r1> show isis database R5.00-00 detail\n" +
"  R5.00-00  Sequence: 0x21  ... \n" +
"    IS Overload bit: SET",
        options: [
          "Do not use R5 as a transit path, but its directly connected prefixes are still reachable",
          "R5 is the DIS",
          "R5 has failed and its routes are withdrawn",
          "R5 is requesting a full database resync"
        ],
        answer: 0, multi: false,
        explanation: "The overload bit tells other routers to avoid R5 for transit (its transit metric becomes effectively unusable) while still reaching R5's own connected prefixes. It is commonly set during maintenance or while BGP converges." },

      // ================= PROTOCOL-INDEPENDENT ROUTING (5) =================
      { id: "W48", domain: "PIR",
        text: "Referring to the exhibit, two static routes to 10.8.0.0/16 exist. Which is used and why?",
        exhibit:
"routing-options static route 10.8.0.0/16 {\n" +
"  next-hop 172.16.1.2;                 # (no preference set)\n" +
"  qualified-next-hop 172.16.9.2 { preference 20; }\n" +
"}",
        options: [
          "next-hop 172.16.1.2, because it uses the default static preference 5 (lower wins)",
          "qualified-next-hop 172.16.9.2, because 20 is higher",
          "Both, load-balanced",
          "Neither; the config is invalid"
        ],
        answer: 0, multi: false,
        explanation: "The primary next hop uses the default static preference of 5, while the qualified-next-hop is given preference 20. Lower preference wins, so 172.16.1.2 is active; the qualified next hop (20) is a backup used only if the primary becomes unusable." },
      { id: "W49", domain: "PIR",
        text: "An aggregate route 10.0.0.0/8 is configured but does not appear active in the routing table. Which condition explains this?",
        options: [
          "No contributing more-specific route to 10.0.0.0/8 currently exists",
          "Aggregate routes are never active",
          "It needs an export policy to activate",
          "The preference is too low"
        ],
        answer: 0, multi: false,
        explanation: "An aggregate route only becomes active when at least one contributing more-specific route exists in the table. With no contributor present, the aggregate stays inactive. (Its default next-hop action is reject once active.)" },
      { id: "W50", domain: "PIR",
        text: "You need packets sourced from 192.168.50.0/24 to use a separate ISP, while everything else uses the default table. Which combination implements this?",
        options: [
          "A firewall filter matching the source that sets 'routing-instance', a forwarding-type instance, and a rib-group to populate that instance's table",
          "An aggregate route plus a generated route",
          "Root guard plus storm control",
          "A single static default route"
        ],
        answer: 0, multi: false,
        explanation: "Filter-based forwarding: a filter matches the source and sets the traffic into a forwarding-type routing instance whose table is populated (via rib-group) with the alternate ISP next hop. Aggregate/generated routes and L2 features do not perform source-based forwarding." },
      { id: "W51", domain: "PIR",
        text: "Referring to the exhibit, what will happen to traffic destined to 172.31.5.5?",
        exhibit:
"user@r> show route 172.31.5.5\n" +
"172.31.0.0/16  *[Static/5] Discard",
        options: [
          "It is silently dropped by the discard next hop",
          "It is dropped and an ICMP unreachable is returned",
          "It is load-balanced",
          "It is forwarded to the RE"
        ],
        answer: 0, multi: false,
        explanation: "A static route with a 'discard' next hop silently drops matching traffic (no ICMP). If the next hop were 'reject', the router would drop the packet and send an ICMP unreachable to the source." },
      { id: "W52", domain: "PIR",
        text: "You configured a per-flow load-balancing policy but only see one next hop installed in the forwarding table. What was most likely omitted?",
        options: [
          "Applying the policy under 'routing-options forwarding-table export'",
          "A martian entry",
          "An aggregate route",
          "A rewrite rule"
        ],
        answer: 0, multi: false,
        explanation: "By default Junos programs a single next hop even with ECMP in the RIB. The load-balancing policy must be applied under 'routing-options forwarding-table export' to install multiple next hops in the PFE. Applying it elsewhere has no forwarding effect." },

      // ================= HIGH AVAILABILITY / TUNNELS (8) =================
      { id: "W53", domain: "HA",
        text: "Referring to the exhibit, an operator ran ISSU but sessions still dropped. Which prerequisite was most likely missing?",
        exhibit:
"user@r> show system switchover\n" +
"  Graceful switchover: On\n" +
"  Nonstop-routing:     Off",
        options: [
          "NSR was off, so routing-protocol state was not preserved across the upgrade",
          "GRES was off",
          "VRRP was not configured",
          "The device had only one Routing Engine"
        ],
        answer: 0, multi: false,
        explanation: "The exhibit shows GRES (graceful switchover) on but nonstop-routing (NSR) off. Unified ISSU relies on NSR to keep routing-protocol adjacencies up during the upgrade; without it, sessions flap even though forwarding is preserved by GRES." },
      { id: "W54", domain: "HA",
        text: "In a Virtual Chassis, a member with the higher configured mastership priority is added AFTER the VC is already formed and running. What typically happens to mastership?",
        options: [
          "The existing master is NOT preempted by default; the new member becomes backup or linecard",
          "The new member immediately becomes master",
          "The whole VC reboots",
          "Both members become master"
        ],
        answer: 0, multi: false,
        explanation: "By default a running Virtual Chassis does not preempt the existing master just because a higher-priority member joins (non-preemptive behavior avoids disruptive re-elections). The new member takes a backup/linecard role unless mastership is deliberately changed." },
      { id: "W55", domain: "HA",
        text: "You need first-hop redundancy where the master also drops mastership if its WAN uplink fails. Which VRRP capability provides the uplink-aware failover?",
        options: [
          "Interface (or route) tracking that decrements priority when the tracked uplink goes down",
          "Lowering the advertisement interval",
          "Disabling preempt",
          "Setting both routers to identical priority"
        ],
        answer: 0, multi: false,
        explanation: "VRRP tracking monitors the uplink and decrements the master's priority when it fails; once priority drops below the backup, the backup takes over. This links gateway mastership to actual upstream reachability." },
      { id: "W56", domain: "HA",
        text: "Which two statements about BFD are correct? (Choose two.)",
        options: [
          "Detection time is approximately the negotiated interval multiplied by the multiplier",
          "It provides fast failure detection that can trigger faster protocol reconvergence",
          "It encrypts the routing protocol it monitors",
          "It replaces the need for a routing protocol"
        ],
        answer: [0, 1], multi: true,
        explanation: "BFD's detection time ≈ interval × multiplier, and it gives sub-second liveness detection that lets OSPF/IS-IS/BGP reconverge faster than their native timers. It neither encrypts traffic nor replaces a routing protocol — it complements one." },
      { id: "W57", domain: "HA",
        text: "A LAG (ae0) with LACP shows one member 'Detached'. Referring to the exhibit, what is the most likely cause?",
        exhibit:
"user@sw> show lacp interfaces ae0\n" +
"  ge-0/0/0   Actor  Collecting Distributing\n" +
"  ge-0/0/1   Actor  Detached  (partner not responding / speed mismatch)",
        options: [
          "ge-0/0/1's partner is not exchanging LACP correctly or its properties (e.g., speed) do not match",
          "ae0 needs an IRB",
          "Storm control detached it",
          "The native VLAN is wrong"
        ],
        answer: 0, multi: false,
        explanation: "A member stays 'Detached' when LACP does not converge on that link — the partner is not responding to LACP or the member's properties (speed/duplex) differ from the bundle. Fixing the peer LACP config or matching link properties brings it into Collecting/Distributing." },
      { id: "W58", domain: "HA",
        text: "You want traffic routed through a GRE tunnel. Which two are TRUE about how the tunnel and traffic must be set up? (Choose two.)",
        options: [
          "The endpoints need a route steering the desired traffic into the gr- interface",
          "The underlay must be able to reach the tunnel's outer source/destination addresses",
          "Every intermediate router must have a route to the inner (encapsulated) networks",
          "GRE must be encrypted for traffic to pass"
        ],
        answer: [0, 1], multi: true,
        explanation: "Traffic uses the tunnel only if a route directs it into the gr- interface, and the underlay must reach the tunnel's outer endpoint addresses. Intermediate routers only forward the outer packet (they need not know the inner networks), and GRE is unencrypted — encryption is not required for it to function." },
      { id: "W59", domain: "HA",
        text: "A GRE tunnel is up, but a downstream OSPF adjacency formed over it flaps whenever large LSAs are exchanged. What is the most likely root cause?",
        options: [
          "The tunnel MTU is too small for the encapsulated OSPF packets, causing drops of large packets",
          "GRE keepalives are disabled",
          "OSPF is not supported over GRE",
          "The tunnel needs MACsec"
        ],
        answer: 0, multi: false,
        explanation: "GRE overhead lowers the effective MTU; large OSPF packets (e.g., DBD/LSU exchanges) exceed it and are dropped, destabilizing the adjacency. Raising the tunnel/path MTU or lowering the OSPF/interface MTU appropriately resolves it. OSPF works fine over GRE otherwise." },
      { id: "W60", domain: "HA",
        text: "Which statement correctly distinguishes nonstop bridging (NSB) from nonstop active routing (NSR)?",
        options: [
          "NSB preserves Layer 2 (e.g., spanning-tree/MAC) state across a switchover; NSR preserves Layer 3 routing-protocol state",
          "NSB preserves routing protocols; NSR preserves Layer 2",
          "They are the same feature",
          "NSB requires no GRES; NSR does"
        ],
        answer: 0, multi: false,
        explanation: "NSB keeps Layer 2 protocol/MAC state (spanning tree, learned MACs) across an RE switchover, while NSR keeps Layer 3 routing-protocol adjacencies/state. Both are built on GRES; they address different layers." }
    ]
  };

  if (typeof ENT_CERT !== "undefined" && ENT_CERT && Array.isArray(ENT_CERT.exams)) {
    // place after the first voucher exam (index 0) if present, else at front
    var idx = 0;
    for (var i = 0; i < ENT_CERT.exams.length; i++) { if (ENT_CERT.exams[i].id === "ENT-VOUCHER") { idx = i + 1; break; } }
    ENT_CERT.exams.splice(idx, 0, EXAM);
  }
  if (typeof module !== "undefined") { module.exports = { ENT_VOUCHER_EXAM_2: EXAM }; }
})();
