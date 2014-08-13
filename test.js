// *****************************************************
// Diff File Directive
// *****************************************************

// add comment on the top

module.directive('diff', ['$stateParams', '$HUB', '$RPC', 'Issue',
    function($stateParams, $HUB, $RPC, Issue) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/diff.html',
            scope: {
                name: '=',
                patch: '=',
                status: '=',
                fileSha: '=',
                pullSha: '=',
                selected: '='
            },
            link: function(scope, elem, attrs) {

                scope.file = null;

                scope.open = true;

                scope.expanded = false;

                // To Do:
                // fix this

                scope.$watch('patch', function() {

                    if(scope.patch) {

                        console.log('we are running this again...');

                        $RPC.call('files', 'get', {
                            user: $stateParams.user,
                            repo: $stateParams.repo,
                            sha: scope.fileSha
                        }, function(err, res) {

                            var file=[], chunks=[];

                            var index = 0;

                            // find the chunks
                            while (index < scope.patch.length) {

                                if(scope.patch[index].chunk) {

                                    var start, end, c=[];

                                    while( ++index<scope.patch.length && !scope.patch[index].chunk ) {

                                        start = start ? start : scope.patch[index].head;

                                        end = scope.patch[index].head ? scope.patch[index].head : end;

                                        c.push(scope.patch[index]);
                                    }

                                    chunks.push({ start:start, end:end, chunk:c });
                                }

                                index = index + 1;
                            }

                            
                            // var chunk = chunks.shift();
                            
                            // comment in the middle

                            index = 0;

                            // insert the chunks
                            while (index < res.value.content.length) {

                                if( chunks[0] && res.value.content[index].head===chunks[0].start ) {

                                    chunk = chunks.shift();

                                    file = file.concat( chunk.chunk );

                                    index = chunk.end;

                                    continue;
                                }

                                file.push( res.value.content[index] );

                                index = index + 1;
                            }

                            scope.file = file;

                        });
                    }

                });

                // 
                // actions
                //
                
                // comment at the end

                scope.match = Issue.line;

                scope.select = function(line) {
                    if(line.head) {
                        var selected = Issue.line(scope.pullSha, scope.name, line.head);
                        scope.selected = scope.selected!==selected ? selected : null;
                    }   
                };

            }
        };
    }
]);
