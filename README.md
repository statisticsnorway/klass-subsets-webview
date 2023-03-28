# subsets-webview

This single page application is built to display information about a KLASS Subset in a human readable and user friendly manner.

It takes as query parameters the `subsetId` of the subset to be displayed, and an optional `language` code ("nb", "en", "nn").

It is built with the purpose of being low maintenance, low effort, and survivable. to achieve this we build it stand-alone from [klass-subsets-client](https://github.com/statisticsnorway/klass-subsets-client), which is a more complex and modern web application used for creating the subsets. We also chose to build it separately from ssb.no in order to avoid issues with compatability, and to avoid the added maintenence due to changes in ssb.no and the more volatile and modern technologies that are used there.
