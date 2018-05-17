Contributing
============
- Create a personal fork of the project on Github.
- Clone the fork on your local machine. Your remote repo on Github is called `origin`.
- Add the original repository as a remote called `upstream`.
```
git remote add upstream https://github.com/potapovDim/interface-webdriver
git remote -v
upstream        https://github.com/potapovDim/interface-webdriver (fetch)
upstream        https://github.com/potapovDim/interface-webdriver (push)
```
- If you created your fork a while ago be sure to pull upstream changes into your local repository.
```
git fetch upstream
git checkout develop
git merge upstream/develop
```
- Create a new branch to work on. Branch from `develop`.
- Implement/fix your feature, comment your code.
- __Follow the code style of the project, including indentation.__
- __Run tests from `__spec__` folder.__
- __Write or adapt tests as needed.__
- __Add or change the documentation as needed.__
- __Squash your commits.__
- Push your branch to your fork on Github, the remote `origin`.
- From your fork open a pull request in the correct branch. Target the project's `develop`.
