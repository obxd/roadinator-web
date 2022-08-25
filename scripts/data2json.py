#/bin/env python

"""
git clone ao-bin-dumps to this dir to run the script
this script generate json
with maps name and description.
"""

from typing import List, Set, Dict, Union
import xml.etree.ElementTree as ET
import re
import sys

RoadTypes :Set[str] = { "TUNNEL_BLACK_LOW" ,"TUNNEL_LOW"          ,"TUNNEL_BLACK_HIGH"
                        ,"TUNNEL_HIGH"     ,"TUNNEL_BLACK_MEDIUM" ,"TUNNEL_MEDIUM"
                        ,"TUNNEL_DEEP"     ,"TUNNEL_ROYAL"        ,"TUNNEL_HIDEOUT"
                        ,"TUNNEL_HIDEOUT_DEEP"
}

def isRoadType(mapType :str) -> bool:
    if mapType in RoadTypes:
        return True
    return False

Templates :Set[str] = {
    # small chests
     "S_FR_ROAD_PVE_Encounter_01" ,"S_FR_ROAD_PVE_Encounter_02"
    # big chests
    ,"M_FR_ROAD_PVE_SOLO_01" ,"M_FR_ROAD_PVE_GROUP_01" ,"M_FR_ROAD_PVE_RAID_01"
    # dungeons 
    ,"S_FR_ROAD_DNG_SOLO_Entrance_01" ,"S_FR_ROAD_DNG_GROUP_Entrance_01" ,"S_FR_ROAD_DNG_RAID_Entrance_01"
    # Guthering stuff
    ,"S_FR_ROAD_RES_Cave_01" ,"S_FR_ROAD_RES_Clearing_01" ,"S_FR_ROAD_RES_MountainSide_01" ,"M_FR_ROAD_RES_Cave_01" ,"M_FR_ROAD_RES_Clearing_01"
}

def GetTierFromString(string :str) -> int:
    """ Return int [4,...,8] from the string where the number is the last
        for example :
        string = "T5/6/7/8" -> 8 :int
        raising  runtime error if not found
    """
    matches = re.search(r"T([4-8]|/)+", string)
    if matches:
        return int(matches.group(0)[-1])
    else:
        raise RuntimeError(f"Unable to get tier from str:'{string}'")

class AttNotFoundExeption(Exception):
    # Exeption to be rised
    pass 

def GetAttValue(element :ET.Element, attrib_name) -> str:
    """ Gets Att value and raise AttNotFoundExeption if value not exist. """
    value :Union[str, None] = element.attrib.get(attrib_name)
    if value == None: 
        raise AttNotFoundExeption(f"unable to find {attrib_name}")
    return value

def GetDisplayname(element :ET.Element) -> str:
    return GetAttValue(element,'displayname')

def GetFilename(element :ET.Element) -> str:
    return GetAttValue(element,'file')

def GetMapType(element :ET.Element) -> str:
    return GetAttValue(element,'type')

def GetRef(element :ET.Element) -> str:
    return GetAttValue(element,'ref')

class Component:
    """
    Maps component, includes the data about the component thier type, size and tier
    this infromation is deduced from ref filename ,parent element name and child element name from ref file by __init__ function
    """
    def __init__(self, refFile :str, parentElName :str, childElName :str):
        self.tier = GetTierFromString(childElName)

        # Small Chests
        if refFile in ( "S_FR_ROAD_PVE_Encounter_01" ,"S_FR_ROAD_PVE_Encounter_02"):
            color = ""
            if "Solo" in parentElName:
                color = "Green"
            elif "Group" in parentElName:
                color = "Blue"
            elif "Raid" in parentElName:
                color = "Gold"
            self.type = color + " Chest"
            self.size = "Small"

        # Big Chests
        elif refFile in ("M_FR_ROAD_PVE_SOLO_01" ,"M_FR_ROAD_PVE_GROUP_01" ,"M_FR_ROAD_PVE_RAID_01"):
            color = ""
            if "SOLO" in refFile:
                color = "Green"
            elif "GROUP" in refFile:
                color = "Blue"
            elif "RAID" in refFile:
                color = "Gold"
            self.type = color + " Chest"
            self.size = "Big"

        # Solo/Group/AVA dungeon
        elif refFile in ( "S_FR_ROAD_DNG_SOLO_Entrance_01" ,"S_FR_ROAD_DNG_GROUP_Entrance_01" ,"S_FR_ROAD_DNG_RAID_Entrance_01"):
            self.type = "Dungeon"
            matches = re.search(r"SOLO|GROUP|RAID", refFile)
            if matches:
                self.size = matches.group(0).title()

        # Guthering stuff
        elif refFile in ( "S_FR_ROAD_RES_Cave_01" ,"S_FR_ROAD_RES_Clearing_01" ,"S_FR_ROAD_RES_MountainSide_01" ,"M_FR_ROAD_RES_Cave_01" ,"M_FR_ROAD_RES_Clearing_01"):
            self.type = childElName.split(" ")[0]
            self.size = parentElName

class Data:
    """
    Holding map data: name of the map, tier, type and components from this map
    """
    def __init__(self, name, tier, type, components):
        self.name = name
        self.tier = tier
        self.type = {    "TUNNEL_BLACK_LOW"    : "L1 Outer"
                        ,"TUNNEL_LOW"          : "L2 Outer"
                        ,"TUNNEL_BLACK_HIGH"   : "L1 Inner"
                        ,"TUNNEL_HIGH"         : "L2 Inner"
                        ,"TUNNEL_BLACK_MEDIUM" : "L1 Middle"
                        ,"TUNNEL_MEDIUM"       : "L2 Middle"
                        ,"TUNNEL_DEEP"         : "Deep"
                        ,"TUNNEL_ROYAL"        : "Royal"
                        ,"TUNNEL_HIDEOUT"      : "Rest"
                        ,"TUNNEL_HIDEOUT_DEEP" : "Deep Rest"
                    }[type]
        self.components = components


class ComponentFactory():
    """
    Factory creating components.
    Extracting the data needed for component creation from maps cluser xml
    that refers to templates xml with layers
    """
    def __init__(self, ao_bin_dumps_path :str):
        self.base_path = ao_bin_dumps_path 
        self.CachedFiles :Dict[str, ET.ElementTree] = dict()


    def cache_or_get_from_cache(self, path) -> ET.ElementTree:
        if path not in self.CachedFiles.keys():
            self.CachedFiles[path] = ET.parse(path)
        return self.CachedFiles[path]


    def createComponents(self, filename :str) -> List[Component]:
        clusterET = self.cache_or_get_from_cache(self.base_path + "/cluster/" + filename)
        root = clusterET.getroot()

        components = list()
        for template in root.findall('.//templateinstance'):
            if template.attrib.get("ref") in Templates:

                active_layers = [ x.attrib.get("id") for x in template.findall("activelayer") ]
                reffilename = GetRef(template)
                path = self.base_path + "/templates/NONE/" + reffilename + ".template.xml"
                refET = self.cache_or_get_from_cache(path)

                parentEL = None
                childEL = None
                for layer in active_layers: 
                    parentEL = refET.find(f"./tiles/*/layer[@id='{layer}']/..")
                    childEL = parentEL.find(f"./layer[@id='{layer}']")
                    if childEL != None and parentEL != None and parentEL.attrib.get("name") != "Layout":
                        break

                if parentEL == None or childEL == None:
                    raise RuntimeError("unable to find non layout layer")

                pname = GetAttValue(parentEL, "name")
                cname = GetAttValue(childEL, "name")
                components.append(Component(reffilename,pname,cname)) 

        return components


class DataFactory():
    """
    Factory for creating data for roads maps
    """
    def __init__(self, ao_bin_dumps_path :str):
        # Geting all roads elements from world.xml
        self.base_path = ao_bin_dumps_path 
        worldRoot = ET.parse(self.base_path + "/cluster/world.xml").getroot()
        self.ava_maps :List[ET.Element] = list()
        for cluster in worldRoot.findall('.//clusters/cluster'):
            try:
                typeAtt = GetMapType(cluster)
                if(isRoadType(typeAtt)):
                    self.ava_maps.append(cluster)
            except AttNotFoundExeption:
                continue
        # Creating ElementFactory
        self.componentFactory = ComponentFactory(ao_bin_dumps_path)


    def CreateMapData(self, mapCluster :ET.Element) -> Data:
        name     :str = GetDisplayname(mapCluster)
        filename :str = GetFilename(mapCluster)
        tier     :int = GetTierFromString(filename)
        typeAtt  :str = GetMapType(mapCluster)
        components = self.componentFactory.createComponents(filename)
        return Data(name, tier, typeAtt, components)


    def CreateAllMapData(self) -> List[Data]:
        maps = list()
        for map in self.ava_maps:
            maps.append(self.CreateMapData(map))
        return maps


def sort_key(component :Component) -> int:
    score = 0
    if "Chest" in component.type:
        # small chests first
        if "Small" == component.size:
            score += 100
        # big chests after small chests
        if "Big" == component.size:
            score += 200
    # dungeon after chests
    elif "Dungeon" == component.type:
        score += 300
    # gathering stuff at the end
    else:
        score += 400
        
    # for chests
    # green < blue < gold
    if "Green" in component.type:
        score += 10
    elif "Blue" in component.type:
        score += 20
    elif "Gold" in component.type:
        score += 30
    # for dungeons and nodes 
    # sort by size
    elif "Solo" == component.size:
        score += 10
    elif "Group" == component.size:
        score += 20
    elif "Raid" == component.size:
        score += 30

    # and at last sort by tier
    score += component.tier
    return score

def color_for_component(component: Component):
    if "Green" in component.type:
        return "#affa1f"
    elif "Blue" in component.type:
        return "#0d8cff"
    elif "Gold" in component.type:
        return "#f2f50f"
    elif "Dungeon" in component.type:
        if "Solo" == component.size:
            return "#affa1f"
        elif "Group" == component.size:
            return "#0d8cff"
        elif "Raid" == component.size:
            return "#f2f50f"
    return None


def write_data_json(data :List[Data]):
    json = "["

    for i, map in enumerate(data):

        if i > 0: 
            json += ','
        json += '{'

        json += '"name":"' +  map.name.lower().replace("-", " ") + '",'
        json += '"data":{'
        json += '"type":"' +  map.type + '",'
        json += '"tier":"' +  str(map.tier) + '",'
        json += '"components":['
        components = sorted(map.components, key=sort_key)
        for i,c in enumerate(components):

            if i > 0: 
                json += ','
            json += '{'
            color = color_for_component(c)
            if color:
                json +=  f'"bgcolor":"{color}",'
            else:
                json +=  '"bgcolor":"transparent",'

            json += '"type":"' +  c.type + '",'
            json += '"size":"' +  c.size + '",'
            json += '"tier":"' +  str(c.tier) + '"'
            json += '}'
        json += ']' # components
        json += '}' # data
        json += '}' # map

    json += ']'

    with open("mapList.json",'w') as file:
        file.write(json)

if __name__ == "__main__":
    DF = DataFactory("./ao-bin-dumps")
    data = DF.CreateAllMapData()
    write_data_json(data)
