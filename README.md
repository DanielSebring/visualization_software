# Info 474: Visualization Software Design

## HotMap!

**Overview**
A library that can take a dataset with Date date and convert it to an aggregate hotmap- all of the data combined into one "year" representation- which is actually a representation of which days every year are either big days in terms of data points gathered, or big days in terms of large observations that occured on that day- either way show what days are more "active" in the data than others.  I envisioned this as a tool for the coming generation of small, low power IoT sensors- things like tire counters for roads, sensors for people going through a gate, etc, since for those you could aggregate easily to compare different months or seasons.  It's proven useful with other things that I tested though, such as plance crashes (why are there more plane crashes March 10th?  There's been 110 on that date alone in the past 100 years!)

Thank you to some inspirations and help-

Month path- the paths around the months are from Mike Bostock's block: https://bl.ocks.org/mbostock/4063318
Tooltips - styling borrowed from this d3noob bl.ock: http://bl.ocks.org/d3noob/a22c42db65eb00d4e369

A couple things to know about HotMap before you can heat to your heart's content.

**Datasets**
Pick a dataset that has a date variable that records year, month, and day. That should be semi-obvious, since this is a calendar.  Pick a csv.  There's some included in the data folder that I used when testing.

**Functions** 
There's a couple of functions you need to use to be able to run HotMap, and a couple that will help your customize your map, and make it EVEN HOTTER.

*Getters:*

`HotMap.getData()`
This will return the value of the data.  Useful when you want to confirm that you didn't screw up d3.csv

**Processing/Setters**
Meke sure to run these functions before running .draw(), because you need all of this data!  Well color is just for fun, but it's an impoirtant customization tool.



`HotMap.setDateColumn(String colName)`
The String passed should be the link to the name of the attribute in your dataset that holds the date information.  That dataset you should already have processed with d3.csv().

`HotMap.substrings(int start, int end)`
Sometimes Dates aren't always the easiest to work with.  In HotMap, we don't currently worry about the hours, minutes, and seconds of a date.
In fact, all we want is a string that represents the month, day and year (in no particular order, you'll do that next) .  Previously you should give HotMap the 
name of the Date column, here you'll tell HotMap where to find that year-month-day representation.  In the column of dates, see when those three values start and end, and 
pass the number of those indexes 

`HotMap.formatDate(String dateFormat)`
Give a string that represents how the date is laid out (for example "%m/%d/%Y").  All options can be found here: https://github.com/mbostock/d3/wiki/Time-Formatting

`HotMap.process(objects[])`
Send HotMap a dataset of objects!  To convert from csv to dataset, checkout d3.csv.

`HotMap.draw()`
Time to go!  Nothing here!  Assuming you've done the previous steps, 

**Optional but hot!**

`HotMap.updateData(objects[])`
This allows you to use different datasets with HotMap.  Make sure you update your format, substrings, and date column name before formatting!

`HotMap.setColor()` 
will change the color of the data set to anything you could possible want.  Try a word, or a hex code, or anything else that css understands.`