library(tidytuesdayR)
library(data.table)

departures <- readr::read_csv('https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2021/2021-04-27/departures.csv')

setDT(departures)

# A really rough sanity check clean
x <- departures[fyear_gone < 2022,
                .(coname,fyear,departure_code,fyear_gone, fyear_gone)]

# Remove NA's, sum departures by year
# Drop dodgy looking years
x <- x[!is.na(fyear_gone) & fyear_gone > 2000 & fyear_gone < 2020,
       .N,
       by = .(year = fyear_gone)]

# Save to disk
write.csv(x[order(year)], file = 'cleaned.csv',row.names = FALSE)
