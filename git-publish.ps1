$repo = 'C:\Users\pierr\Documents\SiteWeb\showcase-and-e-commerce-site'

git -C $repo config user.name 'TylerDurdenTlse'
git -C $repo config user.email 'tylerdurden@example.com'

git -C $repo remote remove origin 2>$null
git -C $repo remote add origin https://github.com/TylerDurdenTlse/GueulesDeVignerons.git

git -C $repo checkout -b feature/initial-site

git -C $repo add .
git -C $repo commit -m 'Initial project setup'
git -C $repo push -u origin feature/initial-site
