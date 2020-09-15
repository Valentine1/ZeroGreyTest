1. The only external libs i used are Bootstrap 4.4 and jQuery 3.4. Using pure JavaScript was organized with MVC like pattern together with dynamic template loading - this allows some modularity. 

2. Support for some older browsers was not priority for the task. Preferences were given to newer JavaScript features like Promises widely supported by modern browsers. Though fixes are possible through usage for polifills - but this is not used until now.

3. Though each model and view was placed into separate physical files for convenience but for production they would be sticked into a single file to optimize loading time.

4. The project cannot be properly launched just by clicking index.html in the file explorer since promises need call to service so some service should be organized. For convenience the project can be accessed also at http://papamax.co/03test/public/html/

5. The project was done in Visua Studio Code and Prettier - Code formatter plugin used for all formatting.

best regards