---
layout: post
title:  "Progress status using PipeViewer while importing MySQL databases"
date:   2016-12-07
excerpt: "How to use PV a terminal based monitoring progress through pipeline while importing MySQL database"
tag:
- linux 
- mysql
---

One of the common command on Linux is to compress or decompress files and folders. While it's easy to do, there is no progress bar
for usual command such as Tar, Zip, Importing to Database or Exporting logs. It may be interesting that there are lots of tools to use. However, I found 
[Pipe Viewer](http://www.ivarch.com/programs/pv.shtml) very handy and useful. 

**PV** _[Pipe Viewer]_ is a terminal-based tool for monitoring 
the progress of data through a pipeline. It can be inserted into any normal pipeline between two processes to give a visual indication of 
how quickly data is passing through, how long it has taken, how near to completion it is, and an estimate of how long it will be until completion.

### Some of the benefits of using PV are:
- Total data transferred
- Time elapsed
- Current throughput rate
- Percentage completed
- ETA

### To Install PV, follow the guides below depends on your OS: 

* **CentOS / RHEL:**	Set up my YUM repository or use RepoForge, then do `yum install pv`.
* **Fedora:**	Run `yum install pv`; the "extras" repository may be required.
* **Debian / Ubuntu:**	Run `apt-get install pv` to get the latest packaged version from `unstable` / `testing`.
* **Slackware:**	Use this SlackBuild script.
* **Cygwin:**	Available as a package.
* **FreeBSD:** Listed on FreshPorts.
* **OpenBSD:** Listed under ports.
* **Solaris:** Download binary packages from OpenCSW.
* **OpenSolaris:**	Includes pv version 1.1.4 in the `/dev` repository (as of build 119). Install with `pkg install SUNWpipe-viewer`.
* **AIX:** An RPM from *Pawel Piatek* is in the downloads section.
* **MacPorts:**	Run `port install pv` to get the latest version. 
* **Mac HomeBrew:**	Run `brew update & brew install pv` to get the latest version. 
* **Exherbo:**	Run `cave resolve -x app-misc/pv` to get the latest version. 
* **Gentoo:**	Run `emerge sys-apps/pv` to get the latest version. 
* **IRIX Nekoware:**	Available in the *Nekoware* "beta" repository.

As an example, I would like to start with using PV while importing a dump of **MySQL** database. 

You are able to import your `.sql` file into the database as easy as the command below:

````
mysql --user=username --password=password database_name < dump.sql
````

which in short is equivalent to 

````
mysql -u username -p password database_name < dump.sql
````

Although it seems quite OK, It is not as helpful as it looks when you have a big file. 
We might have considered better solution as we need to know the status of progress for our 
record. Therefore, here is the usage of PV while importing our dump. 

````
pv your_dump.sql | mysql -u root database_name
````

In this case, you are able to see the progress bar just as below:

![PV Status Bar](/images/dec2016/pv-sample.jpg "Pipe Viewer example")

### More examples to Monitor of PV data progress, sent via a Pipe:

1- To copy a file called your_access.log to /tmp/something-access.log and show progress:

````
pv your_access.log > /tmp/something-access.log
````

2- To compress a lot of files within a folder and seeing progress bar

````
tar cf - /folder-with-big-files -P | pv -s $(du -sb /folder-with-big-files | awk '{print $1}') | gzip > big-files.tar.gz
````

3- To watch how quickly a file is transferred using nc(1):

````
pv file | nc -w 1 somewhere.com 3000
````

4- To transfer a file from another process and passing the expected size to pv:
   
````
cat file | pv -s 12345 | nc -w 1 majidhajian.com 3000
````

5- To decompress a huge tar.gz file

````
pv file.tgz | tar xzf - -C target_directory
````

All in all, Result of all of them like I added a picture to show, is similar as follow:

````
12.16MB 0:00:20 [6.06MB/s] [==================>               ] 55%  ETA 0:00:37
````

I encourage you to read more about this amazing tool and be familiar with that. I have plan to 
publish another article about `screen` which is another great tool and combination of both, will make your
life as a developer more relaxed. 


