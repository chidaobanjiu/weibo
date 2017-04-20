#!/usr/bin/env python3

import sys
from os.path import abspath
from os.path import dirname
import server


sys.path.insert(0, abspath(dirname(__file__)))
application = server

