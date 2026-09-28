/*
 * JNCIS-ENT (JN0-352) — Full-length Voucher-Style Mock Exam.
 * 60 questions, 90-minute fixed clock (timeLimitSec: 5400) to mirror the real exam.
 *
 * Style matches the official voucher assessment: exhibit/trace-log interpretation,
 * BGP table path-selection, "choose two", and behavioral/default-value questions.
 *
 * Weak-area weighting (per user): STP 9, OSPF 10, L2 switching 7, L2 security/filters 7,
 * BGP 8, IS-IS 6, PIR 5, HA 5, Tunnels 3 = 60.
 *
 * IMPORTANT authoring rules applied:
 *  - Correct-answer LENGTH is decoupled from correctness: many correct options are the
 *    SHORT ones with longer, plausible distractors (as in the real exam).
 *  - No question repeats any earlier ENT exam.
 *  - Exhibits use the q.exhibit field (rendered as a monospace block).
 *  - data.js balanceAnswerPositions() further evens the A/B/C/D position of single-answer items.
 *
 * Appends one exam to the FRONT of ENT_CERT.exams (defined in data-ent.js) so it is easy to find.
 */
(function () {
  var EXAM = {
    id: "ENT-VOUCHER",
    name: "★ Full Mock — 60 Q / 90 min (Voucher Style)",
    description: "Full-length, exam-realistic set: 60 questions, 90-minute clock, exhibits and 'choose two', weighted to Spanning Tree, OSPF and Layer 2.",
    timeLimitSec: 5400,
    questions: [
      // ================= SPANNING TREE (9) =================
      { id: "V1", domain: "STP",
        text: "Referring to the exhibit, which switch becomes the root bridge?",
        exhibit:
"Switch   Bridge priority   MAC address\n" +
"SW-A     32768             00:aa:aa:00:00:11\n" +
"SW-B     32768             00:aa:aa:00:00:07\n" +
"SW-C     16384             00:aa:aa:00:00:44\n" +
"SW-D     32768             00:aa:aa:00:00:02",
        options: ["SW-A", "SW-B", "SW-C", "SW-D"],
        answer: 2, multi: false,
        explanation: "Root election compares the bridge ID (priority first, then MAC). SW-C has the lowest priority (16384), so it wins outright regardless of MAC address. MAC would only break a tie if priorities were equal." },
      { id: "V2", domain: "STP",
        text: "Referring to the exhibit, why is ge-0/0/3 in a blocking state?",
        exhibit:
"user@switch> show spanning-tree interface\n" +
"Interface   Port ID   Role   State      Cost\n" +
"ge-0/0/1    128:513   ROOT   FORWARDING 20000\n" +
"ge-0/0/2    128:514   DESG   FORWARDING 20000\n" +
"ge-0/0/3    128:515   ALT    BLOCKING   20000",
        options: [
          "It is an alternate port providing a redundant path to the root, so RSTP blocks it to prevent a loop",
          "It was error-disabled by BPDU protect after receiving an unexpected BPDU on an edge port",
          "It is a configured edge port and therefore does not participate in forwarding",
          "It has the lowest port ID on the switch and loses the designated-port election"
        ],
        answer: 0, multi: false,
        explanation: "An ALT (alternate) port offers a redundant path toward the root; RSTP keeps it in the blocking/discarding state so the topology stays loop-free. It is not error-disabled (that would show for BPDU protect) and it is not an edge port." },
      { id: "V3", domain: "STP",
        text: "An access port with edge and BPDU protect configured receives a BPDU. What is the default result?",
        options: [
          "The port is blocked (disabled)",
          "The port becomes the root port",
          "The BPDU is forwarded unchanged",
          "The port's cost is doubled"
        ],
        answer: 0, multi: false,
        explanation: "BPDU protect disables (blocks/error-disables) an edge port the moment it receives a BPDU, guarding against a rogue switch or accidental loop. Recovery requires a clear or a configured disable-timeout." },
      { id: "V4", domain: "STP",
        text: "Which spanning-tree protocol should you deploy to interoperate with Cisco Rapid-PVST+ so per-VLAN topologies are preserved?",
        options: ["STP", "RSTP", "MSTP", "VSTP"],
        answer: 3, multi: false,
        explanation: "VSTP runs one instance per VLAN and interoperates with Cisco PVST+/Rapid-PVST+. MSTP maps many VLANs into a few instances and needs matching region parameters; plain STP/RSTP run a single instance." },
      { id: "V5", domain: "STP",
        text: "In RSTP, which port role is a standby to the root port and provides an alternate path toward the root bridge?",
        options: ["Designated", "Backup", "Alternate", "Edge"],
        answer: 2, multi: false,
        explanation: "The alternate port is a standby path to the root (it backs up the root port). A backup port instead backs up a designated port on the same shared segment." },
      { id: "V6", domain: "STP",
        text: "You want to prevent a downstream switch from ever becoming the root bridge on a specific interface. Which protection do you apply to that interface?",
        options: ["Loop protect", "Root guard", "BPDU protect", "Storm control"],
        answer: 1, multi: false,
        explanation: "Root guard puts a port into a root-inconsistent (blocking) state if it receives a superior BPDU, so a downstream switch cannot take over as root. Loop and BPDU protect address different problems." },
      { id: "V7", domain: "STP",
        text: "Which protection prevents a blocking port from wrongly transitioning to forwarding if it stops receiving BPDUs (for example on a unidirectional link)?",
        options: [
          "Loop protect",
          "Root guard",
          "MAC limiting",
          "BPDU protect"
        ],
        answer: 0, multi: false,
        explanation: "Loop protect keeps a non-designated (blocking/alternate/root) port from moving to forwarding when expected BPDUs stop arriving, avoiding a loop caused by a unidirectional failure. Root guard acts on superior BPDUs; BPDU protect acts on edge ports that receive any BPDU." },
      { id: "V8", domain: "STP",
        text: "What is the default bridge priority value on a Junos switch running RSTP, and what constraint applies to it?",
        options: [
          "0, and it must be even",
          "1, with no constraint",
          "32768, and it must be a multiple of 4096",
          "65535, and it must be a multiple of 1024"
        ],
        answer: 2, multi: false,
        explanation: "The default bridge priority is 32768 and configurable values must be multiples of 4096 (0, 4096, 8192, …). A lower priority wins the root election." },
      { id: "V9", domain: "STP",
        text: "In an MSTP deployment, two switches will not share the same spanning-tree region. Which set of parameters must match for them to be in the same MST region? (Choose two.)",
        options: [
          "Region name and configuration revision",
          "VLAN-to-instance mapping",
          "Bridge MAC address",
          "Interface cost"
        ],
        answer: [0, 1], multi: true,
        explanation: "Switches are in the same MST region only when the region name, revision number, and VLAN-to-instance mapping all match. Bridge MAC and interface cost do not define region membership." },

      // ================= OSPF (10) =================
      { id: "V10", domain: "OSPF",
        text: "You are troubleshooting OSPF and see the trace shown in the exhibit. What is causing the adjacency to fail?",
        exhibit:
"OSPF rcvd Hello 10.0.1.1 -> 224.0.0.5 (ge-0/0/0.0 area 0.0.0.1)\n" +
"  Version 2, length 44, ID 10.0.1.1, area 0.0.0.1\n" +
"  mask 255.255.255.0, hello_ivl 10, dead_ivl 40, opts 0x12, prio 128\n" +
"OSPF packet ignored: area stubness mismatch from 10.0.1.1 on intf ge-0/0/0.0 area 0.0.0.1",
        options: [
          "MD5 authentication error",
          "Stub area mismatch",
          "Hello interval mismatch",
          "Subnet mask mismatch"
        ],
        answer: 1, multi: false,
        explanation: "The log explicitly states 'area stubness mismatch' — one router has the area configured as stub and the other does not. The stub flag is carried in the Hello options; a mismatch prevents the adjacency. Hello/dead and mask values match in the exhibit." },
      { id: "V11", domain: "OSPF",
        text: "What is the default hello interval and dead interval on a Junos OSPF broadcast interface?",
        options: [
          "hello 5 s, dead 20 s",
          "hello 10 s, dead 40 s",
          "hello 30 s, dead 120 s",
          "hello 10 s, dead 30 s"
        ],
        answer: 1, multi: false,
        explanation: "On broadcast/point-to-point interfaces the default hello is 10 seconds and the dead interval is 40 seconds (4 × hello). Both must match between neighbors for an adjacency to form." },
      { id: "V12", domain: "OSPF",
        text: "Two directly connected routers reach the ExStart/Exchange state but never become Full. Hellos, area, and authentication all match. What is the most likely cause?",
        options: [
          "An MTU mismatch between the two directly connected interfaces on the link",
          "A duplicate OSPF Router ID configured on both of the neighboring routers",
          "A stub-area flag set on one router but not on the neighboring router",
          "A missing export policy preventing routes from being advertised onward"
        ],
        answer: 0, multi: false,
        explanation: "Reaching ExStart/Exchange but stalling there is the classic signature of an interface MTU mismatch — the database description packets cannot be exchanged. A duplicate Router ID or stub mismatch would prevent progress earlier." },
      { id: "V13", domain: "OSPF",
        text: "Referring to the exhibit, which router becomes the designated router (DR) on this broadcast segment, assuming all came up simultaneously?",
        exhibit:
"Router   OSPF interface priority   Router ID\n" +
"R1       1                         10.0.0.1\n" +
"R2       10                        10.0.0.2\n" +
"R3       10                        10.0.0.9\n" +
"R4       0                         10.0.0.20",
        options: ["R1", "R2", "R3", "R4"],
        answer: 2, multi: false,
        explanation: "DR election uses highest priority first, then highest Router ID. R2 and R3 tie at priority 10, so the higher Router ID (10.0.0.9 = R3) wins. R4 with priority 0 is ineligible." },
      { id: "V14", domain: "OSPF",
        text: "Which OSPF LSA type is originated by an ABR to advertise inter-area (summary) routes into an area?",
        options: ["Type 1", "Type 2", "Type 3", "Type 5"],
        answer: 2, multi: false,
        explanation: "Type 3 summary LSAs are generated by ABRs to describe inter-area routes. Type 1/2 are intra-area, and Type 5 external LSAs come from an ASBR." },
      { id: "V15", domain: "OSPF",
        text: "A branch area has no ASBR and should receive only a default route from the ABR, with all summary and external LSAs suppressed. Which area type fits best?",
        options: [
          "Not-so-stubby area",
          "Totally stubby area",
          "Standard area",
          "Backbone area"
        ],
        answer: 1, multi: false,
        explanation: "A totally stubby area blocks Type 3, 4, and 5 LSAs and injects a single default route — ideal for a branch with no ASBR. An NSSA would be used only if a local ASBR must originate externals." },
      { id: "V16", domain: "OSPF",
        text: "By default, what reference bandwidth does Junos use when calculating OSPF interface cost?",
        options: ["10 Mbps", "100 Mbps", "1 Gbps", "10 Gbps"],
        answer: 1, multi: false,
        explanation: "The default reference bandwidth is 100 Mbps; cost = reference-bandwidth ÷ interface-bandwidth (minimum 1). It must be set consistently on all routers or costs become inconsistent." },
      { id: "V17", domain: "OSPF",
        text: "Which command displays the contents of the OSPF link-state database on a Junos device?",
        options: [
          "show ospf neighbor",
          "show ospf database",
          "show ospf interface detail",
          "show route protocol ospf"
        ],
        answer: 1, multi: false,
        explanation: "'show ospf database' displays the LSDB (all LSAs). 'show ospf neighbor' shows adjacency states, and 'show route protocol ospf' shows the OSPF routes installed in the RIB." },
      { id: "V18", domain: "OSPF",
        text: "A non-backbone area is physically separated from area 0 by another area. Which OSPF feature restores backbone connectivity without re-addressing?",
        options: [
          "A virtual link across the transit area",
          "Converting the transit area to a stub",
          "Enabling NSSA on area 0",
          "Increasing the reference bandwidth"
        ],
        answer: 0, multi: false,
        explanation: "A virtual link tunnels backbone connectivity across a non-backbone transit area to reconnect a discontiguous area to area 0. Stub/NSSA settings and reference bandwidth do not repair backbone continuity." },
      { id: "V19", domain: "OSPF",
        text: "On which OSPF network type is no DR/BDR elected?",
        options: ["Broadcast", "NBMA", "Point-to-point", "Point-to-multipoint"],
        answer: 2, multi: false,
        explanation: "Point-to-point links form a single adjacency and elect no DR/BDR. Broadcast and NBMA network types perform DR/BDR election to limit adjacencies on the segment." },

      // ================= LAYER 2 SWITCHING / VLANs (7) =================
      { id: "V20", domain: "L2",
        text: "An untagged frame is received on a trunk interface. With which VLAN is it associated?",
        options: [
          "It is discarded",
          "The native VLAN",
          "VLAN 1",
          "The lowest-numbered member VLAN"
        ],
        answer: 1, multi: false,
        explanation: "Untagged frames arriving on a trunk are placed in the configured native VLAN (native-vlan-id). A native-VLAN mismatch between switches leads to VLAN leaking." },
      { id: "V21", domain: "L2",
        text: "Which configuration statement places interface ge-0/0/6 into a single untagged VLAN named users?",
        exhibit:
"[edit interfaces ge-0/0/6 unit 0 family ethernet-switching]",
        options: [
          "interface-mode trunk; vlan members all",
          "interface-mode access; vlan members users",
          "native-vlan-id users",
          "vlan-tagging"
        ],
        answer: 1, multi: false,
        explanation: "Access mode carries one untagged VLAN; 'interface-mode access' plus 'vlan members users' assigns the port to that VLAN. Trunk mode carries multiple tagged VLANs." },
      { id: "V22", domain: "L2",
        text: "What is the purpose of an IRB interface on a Junos switch?",
        options: [
          "It is the Layer 3 gateway for a VLAN, enabling inter-VLAN routing",
          "It bundles several physical member links into one logical aggregated interface",
          "It mirrors a copy of interface traffic to an attached analyzer or collector",
          "It encrypts and authenticates frames on the link to the next device"
        ],
        answer: 0, multi: false,
        explanation: "An irb.x interface is the Layer 3 gateway for a VLAN/bridge domain and provides inter-VLAN routing. Link bundling is aggregated Ethernet (ae); encryption is MACsec." },
      { id: "V23", domain: "L2",
        text: "By default, how long does a dynamically learned MAC address remain in the Ethernet switching table before aging out if unused?",
        options: ["60 seconds", "120 seconds", "300 seconds", "600 seconds"],
        answer: 2, multi: false,
        explanation: "The default MAC (bridge) table aging timer is 300 seconds. Entries refreshed by traffic are retained; idle entries age out after this interval." },
      { id: "V24", domain: "L2",
        text: "In the 802.1Q header, what is the size of the VLAN tag and the valid range of usable VLAN IDs?",
        options: [
          "2 bytes; 1–1024",
          "4 bytes; 1–4094",
          "4 bytes; 0–4095",
          "8 bytes; 1–8192"
        ],
        answer: 1, multi: false,
        explanation: "The 802.1Q tag is 4 bytes and the usable VLAN ID range is 1–4094 (the 12-bit field's 0 and 4095 are reserved). EtherType for 802.1Q is 0x8100." },
      { id: "V25", domain: "L2",
        text: "A single access port must serve a PC (untagged data) and an IP phone (tagged voice). Which approach supports both on that port?",
        options: [
          "Configure the port to carry the untagged data VLAN plus the tagged voice VLAN",
          "Leave it as a plain access port, since access ports carry two VLANs automatically",
          "Configure an IRB interface on the data VLAN so the phone can be tagged separately",
          "Enable MACsec on the port so the phone and PC traffic are kept isolated by encryption"
        ],
        answer: 0, multi: false,
        explanation: "A pure access port carries a single untagged VLAN. To support untagged data plus tagged voice, the port must carry both (a trunk with the data VLAN untagged/native and the voice VLAN tagged, or an explicit voice-VLAN configuration)." },
      { id: "V26", domain: "L2",
        text: "Which protocol dynamically registers and prunes active VLANs across trunk links so you need not prune them manually?",
        options: ["LLDP", "LACP", "MVRP", "STP"],
        answer: 2, multi: false,
        explanation: "MVRP (Multiple VLAN Registration Protocol) advertises and prunes active VLANs across participating trunks. LLDP is discovery, LACP bundles links, and STP prevents loops." },

      // ================= LAYER 2 SECURITY + FILTERS (7) =================
      { id: "V27", domain: "L2",
        text: "Which statement about the default action of MAC limiting is true when the configured MAC-address limit is reached on a port?",
        options: [
          "The switch stops learning new MACs on the port and drops traffic to/from the offending MAC",
          "The switch immediately shuts down all MAC learning on the offending port for a period of five minutes",
          "The switch stops learning further MAC addresses but then floods the offending MAC's traffic out of every port",
          "The switch administratively disables the offending port for a fixed period of five minutes before recovering"
        ],
        answer: 0, multi: false,
        explanation: "By default MAC limiting stops learning additional MACs on the port and drops packets to/from MAC addresses beyond the limit, while leaving the port up. Shutting the port down is a non-default, explicitly configured action." },
      { id: "V28", domain: "L2",
        text: "Which Layer 2 security feature relies on the DHCP snooping binding table to validate ARP packets and discard spoofed ones?",
        options: [
          "IP source guard",
          "Dynamic ARP inspection",
          "Storm control",
          "MACsec"
        ],
        answer: 1, multi: false,
        explanation: "Dynamic ARP inspection (DAI) checks ARP packets against the DHCP snooping bindings and drops those that do not match, stopping ARP spoofing. IP source guard validates data-plane source IP/MAC using the same bindings." },
      { id: "V29", domain: "L2",
        text: "For DHCP snooping, how should the uplink interface toward the legitimate DHCP server be configured?",
        options: [
          "As trusted, so legitimate server replies are permitted and bindings are learned",
          "As untrusted, so that all DHCP server replies arriving on it are dropped",
          "With DHCP disabled entirely so no snooping bindings are created on it",
          "As an access port placed inside the voice VLAN for the IP phones"
        ],
        answer: 0, multi: false,
        explanation: "The port toward the real DHCP server must be trusted so its OFFER/ACK messages are allowed and bindings are built. Client-facing access ports remain untrusted so a rogue server there is blocked." },
      { id: "V30", domain: "L2",
        text: "Which technology provides encryption and integrity on a single Layer 2 link between two directly connected devices?",
        options: ["IPsec", "MACsec", "GRE", "TLS"],
        answer: 1, multi: false,
        explanation: "MACsec (IEEE 802.1AE) secures traffic hop-by-hop on a directly connected link. IPsec/TLS operate at Layer 3 and above; GRE is unencrypted tunneling." },
      { id: "V31", domain: "POLICY",
        text: "Which family is used for a firewall filter that matches and acts on Ethernet-switched (Layer 2) traffic?",
        options: ["family inet", "family inet6", "family ethernet-switching", "family mpls"],
        answer: 2, multi: false,
        explanation: "Layer 2 filters use 'family ethernet-switching' and can match L2 fields such as source/destination MAC. family inet/inet6 apply to routed IPv4/IPv6 traffic." },
      { id: "V32", domain: "POLICY",
        text: "Referring to the firewall filter in the exhibit, what happens to a frame from source MAC 00:11:22:33:44:55?",
        exhibit:
"filter L2-GUARD {\n" +
"    term BLOCK-HOST {\n" +
"        from { source-mac-address 00:11:22:33:44:55/48; }\n" +
"        then { count bad; discard; }\n" +
"    }\n" +
"    term ALLOW { then accept; }\n" +
"}",
        options: [
          "It is counted in the 'bad' counter and then discarded by term BLOCK-HOST",
          "It falls through and is permitted by the final term named ALLOW",
          "It is counted by BLOCK-HOST and then still accepted by term ALLOW",
          "It is rewritten into a different VLAN before being forwarded normally"
        ],
        answer: 0, multi: false,
        explanation: "Filters evaluate top-down and stop at the first terminating action. Term BLOCK-HOST matches that source MAC, increments counter 'bad' (non-terminating), then 'discard' (terminating) drops it — term ALLOW is never reached for this frame." },
      { id: "V33", domain: "POLICY",
        text: "What is the implicit final action of a Junos firewall filter if a packet matches no term?",
        options: ["accept", "discard", "log and accept", "reject with ICMP"],
        answer: 1, multi: false,
        explanation: "There is an implicit discard at the end of every firewall filter, so any traffic not matched by an explicit accept term is silently dropped." },

      // ================= BGP (8) =================
      { id: "V34", domain: "BGP",
        text: "After receiving a BGP route, which two conditions does the receiving router verify to ensure the route is valid? (Choose two.)",
        options: [
          "That the next hop is reachable",
          "That no loops exist (the router's own AS is not in the AS-path)",
          "That the local preference is greater than 0",
          "That the AS-path length is greater than 0"
        ],
        answer: [0, 1], multi: true,
        explanation: "A received route is valid only if its next hop is resolvable/reachable and it is loop-free (the local AS must not already appear in the AS-path). Local preference and AS-path length are used in best-path selection, not basic validity." },
      { id: "V35", domain: "BGP",
        text: "You are receiving the same prefix from four ISPs as shown in the exhibit. Which ISP is selected as the active path?",
        exhibit:
"Route          Next-hop  AS-Path                  Origin  Local-Pref\n" +
"172.27.0.0/24  ISP 1     65010 65520 65512        IGP     100\n" +
"172.27.0.0/24  ISP 2     65112                    EGP     100\n" +
"172.27.0.0/24  ISP 3     64599 65532 65520 65512  ?       200\n" +
"172.27.0.0/24  ISP 4     65000 65512              EGP     150",
        options: ["ISP 1", "ISP 2", "ISP 3", "ISP 4"],
        answer: 2, multi: false,
        explanation: "Local preference is evaluated first and highest wins. ISP 3 has local-pref 200, higher than all others, so it is selected — even though its AS-path is the longest and its origin is Incomplete. Those later tiebreakers never come into play." },
      { id: "V36", domain: "BGP",
        text: "Place the first four BGP path-selection criteria that Junos evaluates in order (after next-hop validity).",
        options: [
          "AS-path, local preference, origin, MED",
          "Local preference, AS-path length, origin, MED",
          "Origin, MED, local preference, AS-path",
          "MED, origin, AS-path, local preference"
        ],
        answer: 1, multi: false,
        explanation: "Junos compares highest local preference, then shortest AS-path, then lowest origin (IGP < EGP < Incomplete), then lowest MED, before EBGP-over-IBGP and IGP-cost tiebreakers." },
      { id: "V37", domain: "BGP",
        text: "Which statement about IBGP is correct?",
        options: [
          "A route from one IBGP peer is not re-advertised to another IBGP peer by default",
          "IBGP peers are required to be directly connected on the same physical subnet in order to peer",
          "IBGP automatically prepends the local autonomous-system number to the advertised route's AS-path",
          "IBGP establishes each of its peering sessions over UDP using well-known port number 179"
        ],
        answer: 0, multi: false,
        explanation: "The IBGP split-horizon rule means routes from one IBGP peer are not re-advertised to other IBGP peers, which is why a full mesh, route reflectors, or confederations are needed. BGP uses TCP 179 and does not prepend within the same AS." },
      { id: "V38", domain: "BGP",
        text: "You must peer EBGP between two routers' loopback addresses that are not on the same subnet. Which statement is required?",
        options: ["passive", "multihop", "cluster", "damping"],
        answer: 1, multi: false,
        explanation: "EBGP defaults to a TTL of 1, so loopback/multi-hop EBGP requires the 'multihop' statement plus a route to the peer's loopback. IBGP does not need it." },
      { id: "V39", domain: "BGP",
        text: "Which mechanism removes the requirement for a full mesh of IBGP sessions in a large AS?",
        options: [
          "Route reflectors",
          "EBGP multihop",
          "Aggregate routes",
          "Storm control"
        ],
        answer: 0, multi: false,
        explanation: "Route reflectors re-advertise IBGP-learned routes to clients, eliminating the n(n-1)/2 full-mesh requirement. Loop prevention uses ORIGINATOR_ID and CLUSTER_LIST." },
      { id: "V40", domain: "BGP",
        text: "You tag routes with the well-known community no-export before advertising them to a peer. What is the effect?",
        options: [
          "They still propagate internally via IBGP but are not advertised outside the AS/confederation",
          "They are immediately discarded by every router that receives them from the advertising peer",
          "They are prevented from being advertised to any BGP peer whatsoever, internal or external alike",
          "They are automatically assigned the highest possible local-preference value throughout the AS"
        ],
        answer: 0, multi: false,
        explanation: "no-export lets routes propagate internally (IBGP) but prevents advertisement outside the AS/confederation. no-advertise, by contrast, blocks advertisement to any peer including IBGP." },
      { id: "V41", domain: "BGP",
        text: "A BGP route shows an Origin code of Incomplete. What does that usually indicate?",
        options: [
          "The route was redistributed into BGP from another source such as an IGP or a static route",
          "The route was originated directly into BGP by the neighbor using an explicit network statement",
          "The route currently has the shortest autonomous-system path among all of the received candidates",
          "The route has failed its validity check and will therefore be discarded rather than being installed"
        ],
        answer: 0, multi: false,
        explanation: "Origin 'Incomplete' (?) generally means the route entered BGP via redistribution rather than IGP origin (originated by network/aggregate). In selection, IGP origin is preferred over Incomplete." },

      // ================= IS-IS (6) =================
      { id: "V42", domain: "ISIS",
        text: "What is the default IS-IS metric assigned to an interface in Junos, regardless of its speed?",
        options: ["1", "10", "63", "100"],
        answer: 1, multi: false,
        explanation: "Junos assigns a default IS-IS metric of 10 to all interfaces irrespective of bandwidth, so metrics are usually tuned by hand for path control." },
      { id: "V43", domain: "ISIS",
        text: "On a broadcast LAN, which router generates the pseudonode LSP that represents the segment in IS-IS?",
        options: [
          "The router with the lowest system ID",
          "The designated intermediate system (DIS)",
          "The backup DIS",
          "Every router on the LAN"
        ],
        answer: 1, multi: false,
        explanation: "The DIS (highest priority, then highest MAC) generates the pseudonode LSP for a broadcast segment. Unlike OSPF there is no backup DIS, and the DIS can be preempted." },
      { id: "V44", domain: "ISIS",
        text: "Referring to the exhibit, which portion of the NET is the system ID?",
        exhibit:
"NET: 49.0001.1921.6800.1001.00",
        options: ["49", "0001", "1921.6800.1001", "00"],
        answer: 2, multi: false,
        explanation: "The NET breaks into AFI+area (49.0001), the 6-byte system ID (1921.6800.1001), and the NSEL (00, identifying the device itself). The system ID must be unique per router." },
      { id: "V45", domain: "ISIS",
        text: "An IS-IS Level 1 adjacency between two routers will form only when which condition is met?",
        options: [
          "They share the same area address",
          "They have identical system IDs",
          "They have matching hostnames",
          "Both are configured Level 2 only"
        ],
        answer: 0, multi: false,
        explanation: "Level 1 adjacencies require the same area address; Level 2 adjacencies form across areas and provide the backbone. System IDs must be unique, not matching." },
      { id: "V46", domain: "ISIS",
        text: "Per-link IS-IS metrics greater than 63 require which capability to be enabled?",
        options: ["Narrow metrics", "Wide metrics", "The overload bit", "Multi-topology only"],
        answer: 1, multi: false,
        explanation: "The original (narrow) metric field is 6 bits (max 63). Wide metrics use extended TLVs supporting much larger values and are required for metrics above 63 and for TE." },
      { id: "V47", domain: "ISIS",
        text: "During maintenance you want other routers to stop using a router for transit while still reaching its directly connected prefixes. Which mechanism achieves this?",
        options: [
          "Setting the overload bit",
          "Withdrawing the loopback",
          "Disabling wide metrics",
          "Changing the area address"
        ],
        answer: 0, multi: false,
        explanation: "Setting the IS-IS overload bit signals other routers to avoid using this node as a transit path while its own connected routes remain reachable — ideal during maintenance or convergence." },

      // ================= PROTOCOL-INDEPENDENT ROUTING (5) =================
      { id: "V48", domain: "PIR",
        text: "Referring to the exhibit, a packet arrives for 10.5.5.5. Which route does the router use to forward it?",
        exhibit:
"user@router> show route 10.5.5.5\n" +
"10.0.0.0/8      *[Static/5] via ge-0/0/1.0\n" +
"10.5.0.0/16     *[OSPF/10]  via ge-0/0/2.0\n" +
"10.5.5.0/24     *[BGP/170]  via ge-0/0/3.0",
        options: [
          "The static route via ge-0/0/1.0",
          "The OSPF route via ge-0/0/2.0",
          "The BGP route via ge-0/0/3.0",
          "It load-balances across all three"
        ],
        answer: 2, multi: false,
        explanation: "Forwarding always uses the longest (most specific) prefix match first — route preference only breaks ties between routes to the same prefix. 10.5.5.0/24 is the most specific match for 10.5.5.5, so the BGP route is used despite its higher preference value." },
      { id: "V49", domain: "PIR",
        text: "Which static-route next-hop type drops matching traffic silently, without sending an ICMP unreachable?",
        options: ["reject", "discard", "receive", "resolve"],
        answer: 1, multi: false,
        explanation: "'discard' silently drops the packet; 'reject' drops it and returns an ICMP unreachable to the sender." },
      { id: "V50", domain: "PIR",
        text: "Which route type activates only when a contributing more-specific route exists and, by default, uses a reject next hop?",
        options: [
          "Static route",
          "Aggregate route",
          "Generated route",
          "Martian route"
        ],
        answer: 1, multi: false,
        explanation: "An aggregate route activates only with a contributing more-specific route and defaults to a reject next hop. A generated route also needs a contributor but inherits that contributor's real next hop." },
      { id: "V51", domain: "PIR",
        text: "You must route traffic from a specific source subnet out a different path regardless of the destination lookup. Which Junos feature accomplishes this?",
        options: [
          "Filter-based forwarding",
          "An aggregate route",
          "Root guard",
          "Storm control"
        ],
        answer: 0, multi: false,
        explanation: "Filter-based forwarding matches traffic (e.g., by source) in a firewall filter and directs it into a separate routing instance (then routing-instance), overriding normal destination-based routing." },
      { id: "V52", domain: "PIR",
        text: "By default, when multiple equal-cost paths exist, how many next hops does Junos install in the forwarding table without additional configuration?",
        options: [
          "One",
          "Two",
          "All equal-cost next hops",
          "None"
        ],
        answer: 0, multi: false,
        explanation: "By default Junos selects a single active next hop even when ECMP exists in the RIB. To load-balance in the PFE you apply a load-balancing policy under 'routing-options forwarding-table export'." },

      // ================= HIGH AVAILABILITY (5) =================
      { id: "V53", domain: "HA",
        text: "During a Routing Engine switchover with GRES enabled (but nothing else), OSPF and BGP sessions flap. Which feature would keep the routing sessions up?",
        options: [
          "Nonstop active routing (NSR)",
          "Nonstop bridging (NSB)",
          "VRRP",
          "Storm control"
        ],
        answer: 0, multi: false,
        explanation: "GRES preserves forwarding but not routing-protocol state; NSR replicates protocol state to the backup RE so OSPF/BGP adjacencies survive the switchover. NSB does the same for Layer 2." },
      { id: "V54", domain: "HA",
        text: "Which HA feature provides a redundant virtual default-gateway IP for hosts?",
        options: ["BFD", "VRRP", "LACP", "GRES"],
        answer: 1, multi: false,
        explanation: "VRRP presents a shared virtual gateway IP; a master forwards and a backup takes over on failure. BFD is fast failure detection, LACP bundles links, GRES is an RE-switchover feature." },
      { id: "V55", domain: "HA",
        text: "You configure BFD with a minimum interval of 300 ms and a multiplier of 3. What is the approximate failure-detection time?",
        options: ["100 ms", "300 ms", "900 ms", "3 seconds"],
        answer: 2, multi: false,
        explanation: "BFD detection time ≈ interval × multiplier = 300 ms × 3 = 900 ms — far faster than default protocol hold timers." },
      { id: "V56", domain: "HA",
        text: "Which statement correctly contrasts a LAG with a redundant trunk group (RTG)?",
        options: [
          "A LAG forwards on all members at once, while an RTG keeps one link active and one standby",
          "They are functionally identical mechanisms and can be used interchangeably in any switch design",
          "An RTG actively load-balances the traffic across both of its uplink member links simultaneously",
          "A LAG relies on the spanning-tree protocol running over the bundle to prevent a forwarding loop"
        ],
        answer: 0, multi: false,
        explanation: "A LAG (aggregated Ethernet with LACP) uses all members actively for bandwidth and redundancy; an RTG provides active/standby uplinks (only one forwarding) without spanning tree." },
      { id: "V57", domain: "HA",
        text: "Which feature preserves Layer 2 state (such as learned MACs and spanning-tree) across a Routing Engine switchover?",
        options: [
          "Nonstop bridging (NSB)",
          "Nonstop active routing (NSR)",
          "Graceful restart",
          "VRRP"
        ],
        answer: 0, multi: false,
        explanation: "NSB preserves Layer 2 protocol/MAC state across a switchover (the L2 counterpart of NSR for routing). Both build on GRES." },

      // ================= TUNNELS (3) =================
      { id: "V58", domain: "HA",
        text: "You want traffic routed through a GRE tunnel. Which two statements satisfy this requirement? (Choose two.)",
        options: [
          "The tunnel endpoints must have a route that directs the traffic into the tunnel",
          "Keepalives can be used to verify the tunnel on this stateless protocol",
          "All intermediary devices must have a route to the tunnel destinations' inner networks",
          "BFD must be used on the stateless tunneling protocol"
        ],
        answer: [0, 1], multi: true,
        explanation: "Traffic uses a GRE tunnel only if the endpoints have a route steering it into the tunnel interface, and GRE (a stateless protocol) can use keepalives to verify reachability. Intermediary devices only need to reach the tunnel endpoints (outer addresses), not the inner networks, and BFD is not required for GRE to work." },
      { id: "V59", domain: "HA",
        text: "A GRE tunnel passes small packets but drops large ones, and DF-bit traffic fails. What is the most likely cause?",
        options: [
          "The added encapsulation overhead lowered the effective MTU, so large packets are dropped",
          "The GRE encryption keys are mismatched between the two tunnel endpoints, corrupting large frames only",
          "The tunnel logical interface has been placed into the wrong customer VLAN on one of the endpoints",
          "Spanning tree has placed the tunnel interface into a blocking state, discarding the larger packets"
        ],
        answer: 0, multi: false,
        explanation: "GRE headers reduce the usable MTU, so oversized/DF packets are dropped. Fix with TCP MSS clamping, a lower tunnel MTU, or working PMTUD. GRE is not encrypted and has no VLAN/STP dependency." },
      { id: "V60", domain: "HA",
        text: "Which Junos interface type is used to configure a GRE tunnel?",
        options: ["ip-", "gr-", "ae-", "irb"],
        answer: 1, multi: false,
        explanation: "GRE tunnels use gr- interfaces (tunnel services required). ip- is for IP-IP tunnels, ae- is aggregated Ethernet, and irb is integrated routing and bridging." }
    ]
  };

  if (typeof ENT_CERT !== "undefined" && ENT_CERT && Array.isArray(ENT_CERT.exams)) {
    ENT_CERT.exams.unshift(EXAM); // put the full mock first
  }
  if (typeof module !== "undefined") { module.exports = { ENT_VOUCHER_EXAM: EXAM }; }
})();
