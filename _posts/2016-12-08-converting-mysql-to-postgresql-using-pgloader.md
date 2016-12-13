---
layout: post
title:  "Pgloader makes that easy to migrate From Mysql to Postgresql"
date:   2016-12-08
excerpt: "How to migrate from mysql to postgresql with Pgloader as easy as a command line."
tag:
- databases 
- mysql
- postgresql
---

## Decision made

While we were developing our *affiliate manager software* in my company, we (development team) decided to migrate raw data from 
a 3rd party **MySQL**(MariaDB) database which company was using to our **Rails** default db engine which was **PostgresSQL**. 
Thus, I was assigned to do this task. 

I went through many available tools and tested as much as possible. I could not make sure they all are capable 
of handling such a massive sql file. I was about to decide witting a migration script with **NodeJS** that 
I finally found [Pgloader](http://pgloader.io/) by [Dimitri Fontaine](https://twitter.com/tapoueh). 

First, It looked to me very promising and I said to myself: "Yes, this is it.". Before counting, let me say what is Pgloader. 

<blockquote>pgloader is a data loading tool for PostgreSQL, using the COPY command.
Its main advantage over just using COPY or \copy, and over using a Foreign Data Wrapper, is its transaction behaviour, where pgloader will keep a separate file of rejected data, but continue trying to copy good data in your database.
The default PostgreSQL behaviour is transactional, which means that any erroneous line in the input data (file or remote database) will stop the entire bulk load for the table.
pgloader also implements data reformatting, a typical example of that being the transformation of MySQL datestamps 0000-00-00 and 0000-00-00 00:00:00 to PostgreSQL NULL value (because our calendar never had a year zero).
</blockquote>


I started testing that with different circumstances and all test was pretty good. Therefore, I gave it a try and 
run the final command to migrate that the result was pretty awesome in my Mac and I was excited though:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Successfully migrated from <a href="https://twitter.com/hashtag/MySQL?src=hash">#MySQL</a> 5 to <a href="https://twitter.com/hashtag/PostgreSQL?src=hash">#PostgreSQL</a> 9.5, roughly 16GB data, thanks to <a href="https://twitter.com/tapoueh">@tapoueh</a> for a fantastic <a href="https://twitter.com/hashtag/pgloader?src=hash">#pgloader</a> tool <a href="https://t.co/8lDziCnJqV">pic.twitter.com/8lDziCnJqV</a></p>&mdash; Majid Hajian (@mhadaily) <a href="https://twitter.com/mhadaily/status/806763214092414976">December 8, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Although, everything was pretty good on my local machine while I wanted to do that in our **EC2**, I faced with many difficulties as
our server was not as perfect as my local machine with a low memory as small as 512MB until I made [ClozureCL](http://ccl.clozure.com/) on the Ubuntu as a default 
compiler for [Lisp](https://www.common-lisp.net/) which is written's lagrange of Pgloader and performance was incredibly unbelievable. 
 
 <blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/ClozureCL?src=hash">#ClozureCL</a> instead of <a href="https://twitter.com/hashtag/SBCL?src=hash">#SBCL</a> while migrating <a href="https://twitter.com/hashtag/MySQL?src=hash">#MySQL</a> to <a href="https://twitter.com/hashtag/PostgreSQL?src=hash">#PostgreSQL</a> with 16GB data on <a href="https://twitter.com/hashtag/AWS?src=hash">#AWS</a> <a href="https://twitter.com/hashtag/EC2?src=hash">#EC2</a> 512MB RAM!! That&#39;s awesome, thanks <a href="https://twitter.com/tapoueh">@tapoueh</a></p>&mdash; Majid Hajian (@mhadaily) <a href="https://twitter.com/mhadaily/status/807632035300769792">December 10, 2016</a></blockquote>
 <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
 
I encourage you to watch this video : [http://pgloader.io/](Why did pgloader get so much faster?). 

Even though, many different ways of conversions are provided by Pgloader, I pick only migration from Mysql part and write my experience with that.
However, feel free to check Pgloader website's documentation and do more with less!
 
 
## Pgloader installation

Hopefully, Pgloader developed with increasing productivity and performance in mind. So, it is predictable that installing 
this tools would be as easy as a command. To start with that you can read [Quick Start](http://pgloader.io/howto/quickstart.html) on pgloader.io. 

Binary build are available on distributions where pgloader is packaged, which currently includes only **debian** and **apt.postgresql.org** which covers both **debian** and **ubuntu** Operating Systems.

Note that pgloader is easy enough to build from sources, see pgloader INSTALL.md file. For RPM based systems, see also the bootstrap-centos7.sh script that prepares your build environment so that building is then just a git clone then make away.

Building for the **Windows™ Operating System** is easy enough and the platform is fully supported.

 
* **Mac** `brew install pgloader`
* **Ubuntu** `apt-get install pgloader`
* **Docker**: You can also use a docker image for pgloader at https://hub.docker.com/r/dimitri/pgloader/ 

````
$ docker pull dimitri/pgloader
$ docker run --rm --name pgloader dimitri/pgloader:latest pgloader --version
$ docker run --rm --name pgloader dimitri/pgloader:latest pgloader --help
````
* **Build From Source** Pgloader is now a Common Lisp program, tested using the SBCL (>= 1.1.14) and Clozure CL implementations with Quicklisp.

````
apt-get install sbcl unzip libsqlite3-dev make curl gawk freetds-dev libzip-dev
cd /path/to/pgloader
make pgloader
./build/bin/pgloader --help
````
* **Repository**: [To learn more information](https://github.com/dimitri/pgloader)

Please feel free to drop me an email if you need more help.

## Better Performance with ClozureCL 

One of the important problem that I faced, was low memory and killing process by pgloader on our EC2 which has 512MB ram. So, 
Dimitri in one of the issue on Github Suggest to use CCL instead of SBCL so I also recommend to do it as the performance is significantly
better and no issue in dropping process because lack of memory. 

The preferred way to get Clozure CL is via Subversion. For example, to get Clozure CL 1.11 for Darwin/x86, you'd type (where the $ is the shell prompt):

````
svn co http://svn.clozure.com/publicsvn/openmcl/release/1.11/darwinx86/ccl
````

Please follow all the steps (here)(http://ccl.clozure.com/download.html) and after making that done remember to make Pgloader with CCL as follow:

````
make CL=ccl pgloader
````
Now, We are all good to begin.

## Migrating from MySQL

Just create a database where to host the MySQL data and definitions and have pgloader do the migration for you in a single command line:

```
createdb pgdb
```  

a single simple command to start, is just as easy as:

````
pgloader mysql://user@localhost/mydb postgresql:///pgdb 
````

where you can expand your Postgresql link as such:

````
postgres://username:password@server:port/databasename
````

but it my not be enough. For instance, if you are connection to a remote database such a database on **Heroku** where 
it consumes SSL as default, you need to add your params to the url to enable ssl, so command would be as below:

````
postgres://username:password@server:port/databasename?sslmode=require
````

So, if you want to load your pg dump to Heroku you can run as simple as:

````
heroku pg:psql HEROKU_POSTGRESQL_GREEN_URL --app YOUR_APP_NAME_HERE < pgdump
````


## Common issues

You may see the following error for first time: `this is incompatible with sql_mode=only_full_group_by`
but no worries you can easily bypass that. 
You can try to disable the only_full_group_by setting by executing the following:

````
mysql> set global sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
````
or 

````
mysql> set session sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
````

I hope you find this post helpful and feel free to drop an email your feedback which is already appreciated.
