import React from 'react';
import classNames from 'classnames';

interface Props {
    avatarSrc: string;
    id: string;
    size?: number;
}

interface State {
    imageBroken: boolean;
}

// tslint:disable-next-line:no-default-export
export default class Avatar extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.state = {
            imageBroken: false,
        };
    }

    public componentDidUpdate (nextProps: Props) {
        // check src and update onerror state
        if (nextProps.avatarSrc !== this.props.avatarSrc) {
            this.setState({imageBroken: false});
        }
    }

    public handleImageError() {
        this.setState({
            imageBroken: true,
        });
    }


    public render() {
        const { id, avatarSrc, size } = this.props;
        const { imageBroken } = this.state;

        return (
            <div
                className={classNames(
                    'module-avatar',
                    size ? `module-avatar--${size}` : 'module-avatar--48',
                    !imageBroken ? 'module-avatar--with-image' : 'module-avatar--no-image'
                )}
            >
                {/* tslint:disable-next-line:use-simple-attributes */}
                <img
                    onError={() => this.handleImageError()}
                    alt={`avatar_${id}`}
                    src={imageBroken ? 'images/firmen-logo.png' : avatarSrc}
                />
            </div>
        );
    }
}
