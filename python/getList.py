import os,sys,json

def getList():
	listRaw = os.system('sh /home/nrichman/Documents/net_mon/shell/getList.sh')
	listRaw = '\''+str(listRaw)+'\''
	print listRaw
	Obj = json.loads(listRaw)


getList()
