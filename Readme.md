# Email

* Gulp - task manager 
* Gulp Sass - process sass to css 
* Gulp Inline Css - convert css to inline css 
* Gulp Nunjucks HTML - include partials
* Gulp Nunjucks Render - render json data to html template ( for preview )

## Commands
* gulp sass: compiles sass
* gulp devCompile: 
    * takes template, merges snippets and outputs to src/compiled
    * takes compiled and sets inline styles to src/styled
* gulp dev ( in sequence ):
    * compiles sass
    * takes template, merges snippets and outputs to src/compiled
    * takes compiled and sets inline styles to src/styled
* gulp prodCompile: takes template, merges snippets then sets inline styles to sends to templates/
* gulp prod ( in sequence ):
    * compiles sass
    * takes template, merges snippets then sets inline styles to sends to templates/
* gulp render: asks for template name in location of src/template/styled, asks for data file in location of data/ and renders for preview outputting to /src/rendered

------------
## Outstanding Issues
* span tag in html
* date formatting
