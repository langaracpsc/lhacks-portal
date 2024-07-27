import hashlib

def GetSha256Hash(inp: str):
    return hashlib.sha256(inp.encode('utf-8')).hexdigest()