# Info 474: Visualization Software Design

## HotMap!

**Overview**
A library that can take a dataset with Date date and convert it to an aggregate hotmap- all of the data combined into one "year" representation- which is actually a representation of which days every year are either big days in terms of data points gathered, or big days in terms of large observations that occured on that day- either way show what days are more "active" in the data than others.

**Datasets**

**Functions** 
There's a couple of functions you need to use to be able to run HotMap, and a couple that will help your customize your map, and make it EVEN HOTTER.

*Getters:*

** .getData()**
This will return the calue of the data.

*Processing/Setters*

** .setDateColumn(String colName)**
The String passed should be the link to the name of teh dataset that you want to use.  That dataset should be in the data folder. 

** substrings(int start, int end)**
Sometimes Dates aren't always the easiest to work with.  In HotMap, we don't currently worry about the hours, minutes, and seconds of a date.
In fact, all we want is a string that represents the month, day and year (in no particular order, you'll do that next) .  Previously you should give HotMap the 
name of the Date column, here you'll tell HotMap where to find that year-month-day representation.  In the column of dates, see when those three values start and end, and 
pass the number of those indexes 

** formatDate(String dateFormat)**
Give a string that represents how the date is laid out (for example "%m/%d/%Y").  All options can be found here: https://github.com/mbostock/d3/wiki/Time-Formatting

** .process(objects[])**
Send HotMap a dataset of objects!  To convert from csv to dataset, checkout d3.csv.


** .draw() **
Time to go!  Nothing here!