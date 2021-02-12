# CHANGELOG

## 5.1.0
- [X] Fixes bad commonjs/esm import
- [X] Updates dependencies
- [X] Adds this CHANGELOG.md file

## v5.0.2
- [X] Fixes missing js file
- [X] Fixes import syntax in js file
- [X] Removes node 14 requirement

## v5.0.0
### BREAKING CHANGE
- [X] Removes support for @hapi/joi.
  - This means only [@sideway/joi](https://github.com/sideway/joi) is supported.

## v4.2.1
- [X] Adds Typescript Definitions

## v4.2.0
- [X] Adds support for [@sideway/joi](https://github.com/sideway/joi) in addition to @hapi/joi
 
Note: As joi changes over time, this module will exclusively track sideway/joi.

### Peer Dependency
Peer dependency on @hapi/joi has been removed. You will receive a runtime error instead if joi is not peer-installed.
In the future when we exclusively track sideway/joi, the peer dependency will be restored.

## v4.0.0
- [X] [#14] Added support for Joi v16 and v17 and more descriptive error messages.

### BREAKING CHANGES
- Starting with v4 only Joi v16 and higher will be supported.
- Joi is now a peer dependency which should stop any mix version errors.
- Minimum Nodejs version was changed to v10 or higher.
