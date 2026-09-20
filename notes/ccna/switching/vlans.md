# VLANs

A virtual LAN creates a separate Layer 2 broadcast domain on a switch.

## Access Port

An access port carries traffic for one VLAN and normally connects to an end device.

```text
interface GigabitEthernet0/1
 switchport mode access
 switchport access vlan 10
```

## Trunk Port

A trunk carries traffic for multiple VLANs. IEEE 802.1Q inserts a VLAN tag into most frames crossing the trunk.

```text
interface GigabitEthernet0/24
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
```
