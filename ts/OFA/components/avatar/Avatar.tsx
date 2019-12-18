import React from 'react';
import classNames from 'classnames';

interface Props {
    avatarSrc: string;
    id: string;
}

interface State {
    imageBroken: boolean;
}

// tslint:disable-next-line:no-default-export
export default class Avatar extends React.Component<Props, State> {
    public handleImageErrorBound: () => void;

    public constructor(props: Props) {
        super(props);

        this.handleImageErrorBound = this.handleImageError.bind(this);
        this.state = {
            imageBroken: false,
        };
    }

    public handleImageError() {
        this.setState({
            imageBroken: true,
        });
    }

    public render() {
        const { id, avatarSrc } = this.props;
        const { imageBroken } = this.state;

        return (
            <div
                className={classNames(
                    'module-avatar',
                    'module-avatar--48',
                    !imageBroken ? 'module-avatar--with-image' : 'module-avatar--no-image'
                )}
            >
                {/* tslint:disable-next-line:use-simple-attributes */}
                <img
                    onError={this.handleImageErrorBound}
                    alt={`avatar_${id}`}
                    src={imageBroken ? 'images/firmen-logo.png' : avatarSrc}
                />
            </div>
        );
    }
}
