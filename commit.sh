echo 'file(s) to commit'
read filesToCommit

git add "$filesToCommit"

echo 'Enter the commit message:'
read commitMessage

git commit -am "$commitMessage"

echo 'Enter the name of the branch:'
read branch

git push origin $branch