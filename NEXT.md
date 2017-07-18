# The Future

All that is planned in the next releases.

## Version 2.x
### Redux architecture
[Using Redux principles without Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)
to decouple the logic from the HOC. This will make easier to write tests.
### Adding more validators
 - URL - check for valid URL
 - `COUNT` - number of elements in a multi-select
 - `FILE_SIZE` - each file size
 - `POST_SIZE` - total size of files
 - `MIME_TYPE` - type of file
   - `IMAGE` - jpg, jpqg, gif, png (to be specified)
   - `DOCUMENT` - doc, docx, txt, pdf (to be specified)
   - `VIDEO` - (to be specified)
### Whole form sync validations / async validations
Ability to validate the whole form besides validating fields.
### Adding examples / Ready to use components
 - [Material UI](https://github.com/callemall/material-ui)
 - [React Toolbox](http://react-toolbox.com/)
 - [Twitter Bootstrap](http://getbootstrap.com/)
 - Sample to show creating custom components
## Version 3.0.0
### JSON schema validation support
Ability to validate through schemas (i.e. [AJV](https://github.com/epoberezkin/ajv))
(to be specified)
## Next (Strawman)
### Test --watch
### Set up CI
### Providing minified version
### Extend test cases
Consider validating input type
### Wizard forms
### Field groups
Functionality for adding/removing groups of fields. I.e. adding multiple phone numbers.
