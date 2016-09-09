## Bugs 

### In short

* Make sure you have properly installed and configured both Nextcloud and OCR
* Make sure your issue was not [reported](https://github.com/janis91/ocr/issues) before.
* Use the **issue template** when reporting issues.

### Detailed explanation

* Get the latest version of the app from [the releases page](https://github.com/janis91/ocr/releases)
* [Check if they have already been reported](https://github.com/janis91/ocr/issues)
* Please search the existing issues first, it is likely that your issue was already reported or even fixed.
  - Click on "issues" in the column on the right and type any word in the top search/command bar.
  - You can also filter by appending e. g. "state:open" or "state:closed" to the search string.
  - More info on [search syntax within GitHub](https://help.github.com/articles/searching-issues)
* Report the issue using the **issue template** that will be provided, it includes all the information we need to track down the issue.

Help me minimize the effort I spend fixing issues and adding new features, by not reporting duplicate issues, please.

### When reporting bugs

* Enable debug mode by putting this at the bottom of **config/config.php**

```
DEFINE('DEBUG', true);
```

* Turn on debug level debug by adding **`loglevel" => 0,`** to your **config/config.php** and reproduce the problem
* Check **data/owncloud.log**  or **data/nextcloud.log**

## Contributing to Source Code

Thanks for wanting to contribute source code to OCR. You are great!

Before I am able to merge your code into the OCR app, you need to agree to release your code under the AGPL license.

* It's required to add PHPUnit tests and/or Javascript tests (Jasmine) to your pull requests in order to make sure your patches work as intended
* Don't use bleeding edge `core` features unless you have to, instead use the OCP interfaces.
 
We're looking forward to your contributions!

## Translations
Please submit translations via [Transifex][transifex].

[transifex]: https://www.transifex.com/projects/p/nextcloud/
