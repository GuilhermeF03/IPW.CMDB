# CMDB <img src ="https://skillicons.dev/icons?i=js,nodejs,express&perline=8" />

Repository for Introduction to Web Programming course, winter semester of 2022-2023

* Daniel Sousa - nº 48642
* Guilherme Ferreira - nº49472
* Diogo Guerra - nº 49149

<img src ="https://static.wpsocket.com/plugin/movie-database/banner-772x250.png" />

# <strong> Functional requirements </strong>

Develop a web application that provides a web API that follows the REST principles, with responses in JSON format and that supports the following features:

* Get the list of the most popular movies. The request has an optional parameter to limit the number of returned movies (max 250)
* Search movies by name. The request has an optional parameter to limit the number of returned movies (max 250)
* Manage favorite movies groups
    * Create group providing its name and description
    * Edit group by changing its name and description
    * List all groups
    * Delete a group
    * Get the details of a group, with its name, description, the names and total duration of the included movies
    * Add a movie to a group
    * Remove a movie from a group
* Create new user
* For all group operations, a user token must be sent in the Authorization header using a Bearer Token. This token is generated at user creation, and consists of a UUID string, obtained from the ```crypto.randomUUID()``` method.