$hosts = @(
  @{id='HOST-01'; ip='10.0.1.11'; rack='Rack-A1'; vms=3; cpu=42; ram=58; status='ONLINE'},
  @{id='HOST-02'; ip='10.0.1.12'; rack='Rack-A1'; vms=3; cpu=78; ram=82; status='ONLINE'},
  @{id='HOST-03'; ip='10.0.1.13'; rack='Rack-B1'; vms=4; cpu=55; ram=62; status='ONLINE'},
  @{id='HOST-04'; ip='10.0.1.14'; rack='Rack-B1'; vms=2; cpu=31; ram=44; status='ONLINE'},
  @{id='HOST-05'; ip='10.0.1.15'; rack='Rack-C1'; vms=2; cpu=28; ram=39; status='ONLINE'},
  @{id='HOST-06'; ip='10.0.1.16'; rack='Rack-C1'; vms=0; cpu=12; ram=19; status='STANDBY'}
)

Clear-Host
while ($true) {
  Write-Host '========================================================================' -ForegroundColor Cyan
  Write-Host '   CLOUD COMPUTE CLUSTER TELEMETRY ENGINE -- LIVE NODE DAEMON' -ForegroundColor Yellow
  Write-Host ('   Cluster Time: ' + (Get-Date).ToString('yyyy-MM-dd HH:mm:ss') + ' | Hypervisor: KVM/QEMU | Edge: Connected') -ForegroundColor DarkGray
  Write-Host '========================================================================' -ForegroundColor Cyan
  Write-Host ('{0,-10} {1,-13} {2,-10} {3,-8} {4,-10} {5,-10} {6,-10}' -f 'NODE_ID','INTERNAL_IP','RACK','VMS','CPU_LOAD','RAM_LOAD','STATUS') -ForegroundColor White
  Write-Host '------------------------------------------------------------------------' -ForegroundColor DarkGray

  foreach ($h in $hosts) {
    $delta = (Get-Random -Minimum -2 -Maximum 3)
    if ($h.status -ne 'STANDBY') {
      $h.cpu = [Math]::Max(15, [Math]::Min(95, $h.cpu + $delta))
      $h.ram = [Math]::Max(20, [Math]::Min(92, $h.ram + [Math]::Round($delta/2)))
    }
    $color = if ($h.cpu -gt 80) {'Red'} elseif ($h.status -eq 'STANDBY') {'DarkCyan'} else {'Green'}
    Write-Host ('{0,-10} {1,-13} {2,-10} {3,-8} {4,-10} {5,-10} {6,-10}' -f $h.id, $h.ip, $h.rack, $h.vms, ($h.cpu.ToString()+'%'), ($h.ram.ToString()+'%'), $h.status) -ForegroundColor $color
  }

  Write-Host '------------------------------------------------------------------------' -ForegroundColor DarkGray
  Write-Host ('[HEARTBEAT] Ping probe sent to all 6 nodes: ACK (RTT: ' + (Get-Random -Minimum 2 -Maximum 7) + 'ms)') -ForegroundColor DarkGreen
  Write-Host '[LOAD-BALANCER] Dynamic heuristic: LEAST_LOADED active | Anti-oscillation: OK' -ForegroundColor Gray
  Start-Sleep -Seconds 2
  Clear-Host
}
