
#!/usr/bin/env bash

set -eu
set -x

export ORIG_FOLDER=$(pwd)

export VENV_NAME="p3-env-dt"

# Can be executed from anywhere:
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
REPO_ROOT=$(git rev-parse --show-toplevel)
cd $REPO_ROOT

# if behind a firewall
export PIPFLAGS=""

function cleanup_venv() {
    # to refresh:
    set -u
    # rm -rf $REPO_ROOT/temp/p3-for-me
    mkdir -p $REPO_ROOT/temp
    rm -rf $REPO_ROOT/temp
}

function init_venv() {
    # a solution based on `venv` as opposed to `virutalenv`
    # does a `cd`

    if [[ -d $REPO_ROOT/temp/$VENV_NAME ]]; then
        echo "venv already exists"
        return 0
    fi

    echo "INSTALLING THEM: 1. cleanup"
    set -u
    # never parametrize/tokenie/env-ize an `rm -rf`` command
    rm -rf $REPO_ROOT/temp/p3-for-me || :

    cd $REPO_ROOT/temp

    # venv is shipped with python3
    # optional: -v --python=python3
    python3 -m venv $VENV_NAME
    source "$REPO_ROOT/temp/$VENV_NAME/bin/activate"

    python --version
    # Python 3.9.13

    python -m \
      pip install \
      $PIPFLAGS \
      --upgrade pip

    cd $REPO_ROOT
}


# to refresh:
cleanup_venv

mkdir -p temp
ls -1 "$REPO_ROOT/temp/my-bash-utils.sh" >/dev/null || curl -k \
  https://raw.githubusercontent.com/sohale/implisolid/revival-sohale/scripts/bash-utils.sh \
  >$REPO_ROOT/temp/my-bash-utils.sh
source $REPO_ROOT/temp/my-bash-utils.sh


MAKE_HAPPEN "$REPO_ROOT/temp/$VENV_NAME/bin/activate" || {
  init_venv
}

source "$REPO_ROOT/temp/$VENV_NAME/bin/activate"
python --version
export PYTHON_VER="$(ls -1t $REPO_ROOT/temp/$VENV_NAME/lib/ | grep -i "python" | head -n 1)"

export VENV_PACKAGES="$REPO_ROOT/temp/$VENV_NAME/lib/$PYTHON_VER/site-packages"

######################################################
# End of instllations
######################################################

echo "Main script"


source $REPO_ROOT/temp/$VENV_NAME/bin/activate

pip install -r decorator+typing/requirements.txt
# Output:
# ...
pip freeze  # just show packages

echo "source $REPO_ROOT/temp/$VENV_NAME/bin/activate"

echo 'fine'
exit

"""
11? aug 2022
see https://github.com/sosi-org/REST-practice/blob/c5bff6d6f9cb145eb0f4fb0da289f0c6475cd06b/scripts/run_setup.bash


Jul 21, 2022:
based on: https://github.com/sosi-org/scientific-code/blob/be73f7337a13f6438d6984474c034d8ff95795d0/beeseyes/pycode/run_script.bash

   -- not based on: https://github.com/sosi-org/scientific-code/blob/main/timescales-state/run-script.bash

Forked from: https://github.com/sohale/scientific-code-private/blob/main/dependence-paritial-order/run_script.bash
Forked from ~/cs/implisolid/sandbox/sympy-experiment/run_script.bash
Forked from: point-process-simple-example/run_script.bash: https://github.com/sohale/point-process-simple-example/blob/82a62d013d909f365a391aa254dc598d62a0c2d4/run_script.bash
Forked from https://github.com/sosi-org/scientific-code/blob/main/timescales-state/run-script.bash
Forked from https://github.com/sosi-org/primsoup/blob/master/actn/run-actn.bash
https://github.com/sosi-org/scientific-code/blob/main/beeseyes/install-macos.sh
https://github.com/sosi-org/scientific-code/blob/main/beeseyes/pycode/how.sh
https://github.com/sosi-org/scientific-code/blob/main/timescales-state/run-script.bash
4 june -  13 days ago
https://github.com/sosi-org/scientific-code/blob/main/beeseyes/pycode/how.sh
19 May 2021
https://github.com/sohale/bitsurf/blob/master/deploy-run-levels.sh
15 Jan 2021
?
https://github.com/sosi-org/grpc-arch-practice/blob/master/nov-2020/init.sh
19 Nov 2020
4 October 2020
?
https://github.com/sosi-org/grpc-arch-practice/blob/master/tf-serving-18-sept-2020/prepare-env.sh
22 Sep 2020
*
https://github.com/sosi-org/grpc-arch-practice/blob/master/tfserving-example/source-tf1.sh
11 Jul 2020
https://github.com/sohale/nedanepy/blob/master/vend-instructions.md
3 Apr 2020
https://github.com/sosi-org/neural-networks-sandbox/blob/master/glyphnet/tests/run_all_tests.sh
30 Dec 2019
https://github.com/sosi-org/neural-networks-sandbox/blob/master/glyphnet/used_refs.md
22 Dec 2019
(as note)
notes from:
https://github.com/sosi-org/neural-networks-sandbox/blob/master/dataset-from-stan/extract_plans_from_grid.py
11 Nov 2019
https://github.com/ladanalavi/phd-thesis/blob/master/gan/linux%20tesla%20kent.txt
11 Nov 2019
16 Feb 2019
https://github.com/ladanalavi/phd-thesis/blob/master/gan/notes.txt
16 Feb 2019
https://github.com/sosi-org/REST-practice/blob/master/readme.md
19 Sep 2018

"""
