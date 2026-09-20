# ARP

Address Resolution Protocol maps a known IPv4 address to a Layer 2 MAC address on the local network.

## Basic Process

1. The sender checks its ARP cache.
2. If no entry exists, it sends an ARP request as an Ethernet broadcast.
3. The device that owns the requested IPv4 address sends an ARP reply.
4. The sender stores the mapping temporarily in its ARP cache.

## Important Detail

The ARP **request** uses the broadcast destination MAC address `ffff.ffff.ffff`. The ARP **reply** is normally sent as a unicast frame.

## Useful Commands

```text
show ip arp
arp -a
ip neigh show
```
