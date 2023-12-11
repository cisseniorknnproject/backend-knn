from bson import ObjectId
from pymongo import MongoClient
from math import sqrt

client = MongoClient("mongodb+srv://devwithpatty:ivRecsDAVHpfZPad@nppdb.youdt1r.mongodb.net/?retryWrites=true&w=majority")
db = client["nppdb"]
orderscols = db["orders"]

orderA = []
orders = orderscols.find()

for i in orders:
    orderA.append(i)

print(orderA[-1]["Uid"])
uid = orderA[-1]["Uid"]
print(orderA[-1]["OrderItem"][0]["ProductId"])
ProductId = orderA[-1]["OrderItem"][0]["ProductId"]

productCols = db["products"]
products = productCols.find({"_id": ObjectId(ProductId)})

price = 0
category = 0
modelNumber = 0

for i in products:
    price = i["price"]

    if i["category"] == "Rubber Dome":
        category = 1
    elif i["category"] == "Gaming":
        category = 2
    elif i["category"] == "Mechanical":
        category = 3

    modelNumber = i["modelNumber"]

print("price =", price)
print("category =", category)
print("modelNumber =", modelNumber)



'''
1 = Rubber Dome
2 = Gaming
3 = Mechanical
'''

datas = []
dataset = []
credit = []

#import dataset from csv
f = open('tests/orderdataset.csv', 'r')
while True:
    data = f.readline()
    if data == '':
        break
    else:
        pre_data = data.strip('\n').split(',')
        datas.append(pre_data)
f.close()

for i in range(len(datas)):
    d_list = []
    for j in range(len(datas[i])):
        if j == 3:
            continue
        else:
            d_list.append(int(datas[i][j]))

        if len(d_list) == 3:
            dataset.append(d_list)

print(dataset)

def euclidean_distance(row1, row2):
	distance = 0.0
	for i in range(len(row1)-1):
		distance += (row1[i] - row2[i])**2
	return sqrt(distance)

def knn(train, test):
    distances = list()
    for train_row in train:
        dist = euclidean_distance(test, train_row)
        distances.append((train_row, dist))

    distances.sort(key=lambda tup: tup[1])
    print("Distance = ", distances)
    neighbors = list()
    for i in range(5):
        neighbors.append(distances[i][0])

    print("neighbors = ", neighbors)

    return neighbors

test_data = [modelNumber, category, price]
result = knn(dataset, test_data)

print("result =", result)

recommend = db["recomends"]
data = [
    {"userid": uid, "firstItem": result[1][0], "secondItem": result[2][0], "thirdItem": result[3][0]}
]

x = recommend.insert_many(data)
print(x.inserted_ids)

client.close()