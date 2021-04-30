require(data.table)
require(ggplot2)
require(viridis)
require(ggtext)

# Load the data
tidy.week <- '2021-04-13'
tuesdata <- tidytuesdayR::tt_load(tidy.week)


# Data Wrangling/Prep -----------------------------------------------------
x <- data.table(tuesdata$post_offices)

x <- x[, .(name, established, discontinued, state)]
# clean data a bit
x <- x[established > 1400 &
         #!is.na(established) & 
         discontinued < 2001 &
         discontinued > 1400]

# Number of openings/closures by year
z <- merge(
  x[, .(new = .N), by = .(Y = established ,state)], 
  x[, .(closed = .N), by = .(Y = discontinued, state)], 
  by = c('Y', 'state'), 
  all.x = TRUE,
  all.y = TRUE)

z[is.na(new), new := 0]
z[is.na(closed), closed := 0]
z[, net := new - closed]
z <- z[Y > 1799 & Y < 1951]

setkey(z, Y, state)
z <- z[state %in% c('CA', 'CO', 'NY')]

write.csv(z, file = 'cleaned.csv', row.names = FALSE)
