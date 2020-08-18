---
date:   "2018-12-07"
title:  "Git rename local and remote branch"
category: "git"
tags: ['git']
banner: ""
---

1- rename local branch if you are on the branch 
`git branch -m branch-name-name`

2- if you are on the different branch 
`git branch -m branch-old-name branch-new-name`

3- to delete old branch name and replace it with new name to origin
`git push origin :branch-old-name branch-new-name`

4- step 3 will do the trick however, if you want to reset your upstream branch for new branch
`git push origin -u branch-new-name`


Usefull tip 
find first commit in a specific branch 
`git log <source_branch>..<feature_branch> --oneline | tail -1`
for instance 
```
git log master..feature/tree-shakable-components  --oneline | tail -1
 
f601a16 upgrade to latest babel 7 and lodash es in order to make bundle be tree shakable
```
