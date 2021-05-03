library(tidytuesdayR)
library(data.table)


# Data Prep ---------------------------------------------------------------
# Read the data
tidy.week <- '2019-01-15'
tt_data <- tt_load(tidy.week) 
x <- data.table(tt_data$launches)
x <- x[launch_date < '2022-01-01'] # really simple clean
x[, dodge := runif(.N, 0, 1)]

write.csv(
  x[, .(launch_date, agency_type, mission, dodge)],
  file = 'cleaned.csv',
  row.names = FALSE)


