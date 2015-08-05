library (jsonlite)
all.equal(mtcars, fromJSON(toJSON(mtcars)))

dirData <- "../train/"
files = c("0", "1", "2", "3", "4", "6", "8", "9")
#files = c("1")
cols = c("xLen", "yLen", "ratio", "percAboveHoriz", "percBelowHoriz", 
         "percOnRight", "percOnLeft", "avgDistFromCent", 
         "tr", "r", "br", "b", "bl", "l", "tl", "t")
dataMeans = matrix(0, nrow=length(files), ncol=length(cols))
colnames (dataMeans) <- cols
rownames (dataMeans) <- files
dataSds = matrix(0, nrow=length(files), ncol=length(cols))
colnames (dataSds) <- cols
rownames (dataSds) <- files

for  (name in files) {
  aFile = paste (dirData, name, ".csv", sep="")
  data = read.csv (aFile, header = FALSE)
  names (data) <- cols
  
  #for(colN in names(data)){
  #  plot (data[[colN]], ylab=colN)
  #  readline ()
  #}
  
  dataMeans[name, ] = apply (data, 2, mean)
  dataSds[name, ] = apply (data, 2, sd)
}
print (dataMeans)
print (dataSds)

#print (as.data.frame(dataMeans))
frameMeans <- as.data.frame(dataMeans)
frameMeans$Class <- files
print (toJSON(frameMeans, pretty=TRUE))
write (toJSON(frameMeans, pretty=FALSE), "dataMeans.js")

frameSds <- as.data.frame(dataSds)
frameSds$Class <- files
print (toJSON(frameSds, pretty=TRUE))
write (toJSON(frameSds, pretty=FALSE), "dataSds.js")