# OSPF

Open Shortest Path First is a link-state interior gateway protocol. Routers exchange link-state information, build a common link-state database, and run the shortest path first algorithm to calculate routes.

## Neighbor States

1. Down
2. Init
3. 2-Way
4. ExStart
5. Exchange
6. Loading
7. Full

## Router ID Selection

OSPF selects its router ID in this order:

1. Manually configured router ID
2. Highest IPv4 address on an up/up loopback interface
3. Highest IPv4 address on an up/up physical interface

## Useful Commands

```text
show ip ospf neighbor
show ip ospf interface brief
show ip ospf database
show ip route ospf
```

## Quick Troubleshooting Checklist

| Check | What to verify |
| --- | --- |
| Interface | Up/up and included in OSPF |
| Area | Matching area IDs |
| Timers | Matching hello and dead intervals |
| Network type | Compatible OSPF network types |
| Authentication | Matching type and credentials |
| MTU | Matching interface MTU during database exchange |
